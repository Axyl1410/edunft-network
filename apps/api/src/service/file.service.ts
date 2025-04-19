import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateItemDto } from 'src/dto/file.dto';
import { FileCID, FileCIDDocument } from '../schema/file-cid.schema';
import { File, FileDocument } from '../schema/file.schema';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(FileCID.name) private filecidModel: Model<FileCIDDocument>,
  ) {}

  // Create FileCID by ownerAddress only
  async create(ownerAddress: string): Promise<FileCID> {
    let ownerFile = await this.fileModel
      .findOne({ address: ownerAddress })
      .exec();

    if (!ownerFile) {
      const newOwnerFile = new this.fileModel({ address: ownerAddress });
      try {
        ownerFile = await newOwnerFile.save();
      } catch (ownerSaveError) {
        console.error('Error creating new owner file record:', ownerSaveError);
        throw new InternalServerErrorException(
          'Failed to create new owner file record.',
        );
      }
    }

    const newFileCID = new this.filecidModel({
      address: ownerAddress, // <-- add this line
      file: ownerFile._id,
      items: [],
    });

    try {
      return await newFileCID.save();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new BadRequestException(
          `FileCID for owner "${ownerAddress}" already exists.`,
        );
      }
      throw error;
    }
  }

  // Add item by ownerAddress
  async addItemToFileCID(
    ownerAddress: string,
    itemData: CreateItemDto,
  ): Promise<FileCID> {
    const ownerFile = await this.fileModel
      .findOne({ address: ownerAddress })
      .exec();

    if (!ownerFile) {
      throw new NotFoundException(
        `Owner file with address "${ownerAddress}" not found.`,
      );
    }

    const fileCIDDoc = await this.filecidModel
      .findOne({ file: ownerFile._id })
      .exec();

    if (!fileCIDDoc) {
      throw new NotFoundException(
        `FileCID for owner "${ownerAddress}" not found.`,
      );
    }

    const existingItem = fileCIDDoc.items.find(
      (item) => item.itemId === itemData.itemId,
    );

    if (existingItem) {
      throw new BadRequestException(
        `Item with itemId "${itemData.itemId}" already exists.`,
      );
    }

    const newItem = { ...itemData, isNFT: false };
    const updatedFileCID = await this.filecidModel
      .findOneAndUpdate(
        { file: ownerFile._id },
        { $push: { items: newItem } },
        { new: true },
      )
      .exec();

    if (!updatedFileCID) {
      throw new NotFoundException(
        `FileCID for owner "${ownerAddress}" not found when updating.`,
      );
    }

    return updatedFileCID;
  }

  // Mark item as NFT by ownerAddress
  async markItemAsNFT(ownerAddress: string, itemId: string): Promise<FileCID> {
    const ownerFile = await this.fileModel
      .findOne({ address: ownerAddress })
      .exec();

    if (!ownerFile) {
      throw new NotFoundException(
        `Owner file with address "${ownerAddress}" not found.`,
      );
    }

    const updatedFileCID = await this.filecidModel
      .findOneAndUpdate(
        { file: ownerFile._id, 'items.itemId': itemId },
        { $set: { 'items.$.isNFT': true } },
        { new: true },
      )
      .exec();

    if (!updatedFileCID) {
      throw new NotFoundException(
        `Item with itemId "${itemId}" not found for owner "${ownerAddress}".`,
      );
    }
    return updatedFileCID;
  }

  // Transfer FileCID to new owner
  async transferFileCID(
    ownerAddress: string,
    newOwnerAddress: string,
  ): Promise<FileCID> {
    const ownerFile = await this.fileModel
      .findOne({ address: ownerAddress })
      .exec();
    const newOwnerFile = await this.fileModel
      .findOne({ address: newOwnerAddress })
      .exec();

    if (!ownerFile) {
      throw new NotFoundException(
        `Owner file with address "${ownerAddress}" not found.`,
      );
    }

    if (!newOwnerFile) {
      throw new NotFoundException(
        `New owner file with address "${newOwnerAddress}" not found.`,
      );
    }

    const updatedFileCID = await this.filecidModel
      .findOneAndUpdate(
        { file: ownerFile._id },
        { $set: { file: newOwnerFile._id } },
        { new: true },
      )
      .populate('file')
      .exec();

    if (!updatedFileCID) {
      throw new NotFoundException(
        `FileCID for owner "${ownerAddress}" not found.`,
      );
    }

    return updatedFileCID;
  }

  // Find FileCID by ownerAddress
  async findOneByOwnerAddress(ownerAddress: string): Promise<FileCID | null> {
    const ownerFile = await this.fileModel
      .findOne({ address: ownerAddress })
      .exec();
    if (!ownerFile) return null;
    return this.filecidModel
      .findOne({ file: ownerFile._id })
      .populate('file')
      .exec();
  }
}
