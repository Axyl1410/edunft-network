import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FileCID } from '../schemas/file-cid.schema';
import { FileService } from '../service/file.service';

// DTO cho việc tạo FileCID
interface CreateFileCIDDto {
  cidAddress: string; // Địa chỉ CID
  ownerAddress: string; // Địa chỉ ví sở hữu
}

// DTO cho việc thêm item
interface CreateItemDto {
  itemId: string;
  name?: string;
}

// DTO cho việc chuyển quyền sở hữu
interface TransferFileCIDDto {
  newOwnerAddress: string; // Địa chỉ ví mới
}

@Controller('file-cid') // Endpoint gốc vẫn giữ nguyên
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // --- Endpoint tạo FileCID mới ---
  @Post('create')
  async createFileCID(
    @Body() createFileCIDDto: CreateFileCIDDto,
  ): Promise<FileCID> {
    const { cidAddress, ownerAddress } = createFileCIDDto;
    if (!cidAddress || !ownerAddress) {
      throw new BadRequestException(
        'cidAddress and ownerAddress are required.',
      );
    }
    // Gọi service với đúng tên tham số
    return this.fileService.create(cidAddress, ownerAddress);
  }

  // --- Endpoint thêm item vào FileCID ---
  // Sử dụng địa chỉ CID làm parameter
  @Put(':address/add-item')
  async addItemToFileCID(
    @Param('address') cidAddress: string, // Nhận địa chỉ CID từ URL
    @Body() createItemDto: CreateItemDto,
  ): Promise<FileCID> {
    if (!createItemDto.itemId) {
      throw new BadRequestException('itemId is required.');
    }
    return this.fileService.addItemToFileCID(cidAddress, createItemDto);
  }

  // --- Endpoint đánh dấu item là NFT ---
  // Sử dụng địa chỉ CID và itemId làm parameter
  @Put(':address/mark-item-nft/:itemId')
  async markItemAsNFT(
    @Param('address') cidAddress: string, // Nhận địa chỉ CID từ URL
    @Param('itemId') itemId: string,
  ): Promise<FileCID> {
    if (!itemId) {
      throw new BadRequestException('itemId is required.');
    }
    return this.fileService.markItemAsNFT(cidAddress, itemId);
  }

  // --- Endpoint chuyển FileCID sang File (địa chỉ ví) khác ---
  // Sử dụng địa chỉ CID làm parameter
  @Put(':address/transfer')
  async transferFileCID(
    @Param('address') cidAddress: string, // Nhận địa chỉ CID từ URL
    @Body() transferDto: TransferFileCIDDto,
  ): Promise<FileCID> {
    const { newOwnerAddress } = transferDto;
    if (!newOwnerAddress) {
      throw new BadRequestException('newOwnerAddress is required.');
    }
    return this.fileService.transferFileCID(cidAddress, newOwnerAddress);
  }

  // --- Endpoint lấy chi tiết FileCID bằng địa chỉ (CID) ---
  // Sử dụng địa chỉ CID làm parameter
  @Get(':address')
  async getFileCID(
    @Param('address') cidAddress: string,
  ): Promise<FileCID | null> {
    // Nhận địa chỉ CID từ URL
    // Gọi hàm service đã đổi tên
    const fileCIDDetails = await this.fileService.findOneByAddress(cidAddress);
    if (!fileCIDDetails) {
      throw new NotFoundException(
        `FileCID with address "${cidAddress}" not found.`,
      );
    }
    return fileCIDDetails;
  }
}
