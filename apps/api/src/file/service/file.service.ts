import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileCID, FileCIDDocument } from '../schemas/file-cid.schema';
import { File, FileDocument } from '../schemas/file.schema';

interface CreateItemDto {
  itemId: string;
  name?: string;
}

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(FileCID.name) private filecidModel: Model<FileCIDDocument>,
  ) {}

  // --- Hàm tạo FileCID mới ---
  async create(cidAddress: string, ownerAddress: string): Promise<FileCID> {
    // Đổi tên tham số
    const ownerFile = await this.fileModel
      .findOne({ address: ownerAddress })
      .exec(); // Tìm bằng address ví
    if (!ownerFile) {
      throw new NotFoundException(
        `File (owner) with address "${ownerAddress}" does not exist.`,
      );
    }
    const newFileCID = new this.filecidModel({
      address: cidAddress, // Lưu CID vào trường address
      file: ownerFile._id, // Liên kết với _id của File (chứa địa chỉ ví)
      items: [],
    });
    try {
      return await newFileCID.save();
    } catch (error) {
      if (error.code === 11000) {
        // Kiểm tra lỗi trùng lặp dựa trên index unique của trường 'address' trong FileCIDSchema
        throw new BadRequestException(
          `FileCID with address "${cidAddress}" already exists.`,
        );
      }
      throw error;
    }
  }

  // --- Hàm thêm item vào FileCID ---
  async addItemToFileCID(
    cidAddress: string, // Đổi tên tham số
    itemData: CreateItemDto,
  ): Promise<FileCID> {
    const fileCIDDoc = await this.filecidModel
      .findOne({ address: cidAddress }) // Tìm bằng address (CID)
      .exec();

    if (!fileCIDDoc) {
      throw new NotFoundException(
        `FileCID with address "${cidAddress}" not found.`,
      );
    }

    const existingItem = fileCIDDoc.items.find(
      (item) => item.itemId === itemData.itemId,
    );
    if (existingItem) {
      throw new BadRequestException(
        `Item with itemId "${itemData.itemId}" already exists in FileCID "${cidAddress}".`,
      );
    }

    const newItem = {
      ...itemData,
      isNFT: false,
    };

    const updatedFileCID = await this.filecidModel
      .findOneAndUpdate(
        { address: cidAddress }, // Tìm bằng address (CID)
        { $push: { items: newItem } },
        { new: true },
      )
      .exec();

    if (!updatedFileCID) {
      // Trường hợp hiếm gặp
      throw new NotFoundException(
        `FileCID with address "${cidAddress}" not found when updating.`,
      );
    }

    return updatedFileCID;
  }

  // --- Hàm đánh dấu item là NFT ---
  async markItemAsNFT(cidAddress: string, itemId: string): Promise<FileCID> {
    // Đổi tên tham số
    const updatedFileCID = await this.filecidModel
      .findOneAndUpdate(
        { address: cidAddress, 'items.itemId': itemId }, // Tìm bằng address (CID) và itemId
        { $set: { 'items.$.isNFT': true } },
        { new: true },
      )
      .exec();

    if (!updatedFileCID) {
      const fileCIDExists = await this.filecidModel
        .findOne({ address: cidAddress }) // Tìm bằng address (CID)
        .exec();
      if (fileCIDExists) {
        throw new NotFoundException(
          `Item with itemId "${itemId}" not found in FileCID "${cidAddress}".`,
        );
      } else {
        throw new NotFoundException(
          `FileCID with address "${cidAddress}" not found.`,
        );
      }
    }

    return updatedFileCID;
  }

  // --- Hàm chuyển FileCID sang File (địa chỉ ví) khác ---
  async transferFileCID(
    cidAddress: string, // Đổi tên tham số
    newOwnerAddress: string, // Đổi tên tham số
  ): Promise<FileCID> {
    const newOwnerFile = await this.fileModel
      .findOne({ address: newOwnerAddress })
      .exec(); // Tìm File mới bằng address ví
    if (!newOwnerFile) {
      throw new NotFoundException(
        `New owner File with address "${newOwnerAddress}" does not exist.`,
      );
    }

    const updatedFileCID = await this.filecidModel
      .findOneAndUpdate(
        { address: cidAddress }, // Tìm bằng address (CID)
        { $set: { file: newOwnerFile._id } }, // Cập nhật trường 'file' tham chiếu đến File mới
        { new: true },
      )
      .populate('file') // Populate thông tin File mới (chứa địa chỉ ví)
      .exec();

    if (!updatedFileCID) {
      throw new NotFoundException(
        `FileCID with address "${cidAddress}" not found.`,
      );
    }

    return updatedFileCID;
  }

  // --- Hàm tìm FileCID bằng địa chỉ (CID) ---
  async findOneByAddress(cidAddress: string): Promise<FileCID | null> {
    // Đổi tên tham số và hàm
    return this.filecidModel
      .findOne({ address: cidAddress }) // Tìm bằng address (CID)
      .populate('file') // Populate để lấy thông tin File (chứa địa chỉ ví)
      .exec();
  }
}
