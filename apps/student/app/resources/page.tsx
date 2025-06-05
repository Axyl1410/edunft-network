"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Calendar,
  File,
  HelpCircle,
  ShoppingBag,
  Tag,
  User,
} from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Resources & Wiki</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-6 text-base">
            <li>
              <a href="#profile" className="text-blue-600 hover:underline">
                Profile & Account
              </a>
            </li>
            <li>
              <a href="#buy" className="text-blue-600 hover:underline">
                Buy NFT
              </a>
            </li>
            <li>
              <a href="#events" className="text-blue-600 hover:underline">
                Events & Competitions
              </a>
            </li>
            <li>
              <a href="#question" className="text-blue-600 hover:underline">
                Q&A Arena
              </a>
            </li>
            <li>
              <a href="#token" className="text-blue-600 hover:underline">
                NFT & Token Details
              </a>
            </li>
            <li>
              <a href="#file" className="text-blue-600 hover:underline">
                File Management
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Profile Section */}
      <Card id="profile" className="mb-8">
        <CardHeader>
          <CardTitle>Profile & Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Trang <b>Profile</b> cho phép bạn xem và chỉnh sửa thông tin cá
            nhân, avatar, banner, bio, vai trò (student/teacher/admin), điểm uy
            tín (reputation), số lần vi phạm, trạng thái ban.
          </p>
          <ul className="list-disc pl-6">
            <li>
              Chỉnh sửa thông tin: Nhấn <b>Edit Profile</b> để cập nhật tên,
              bio, avatar, banner.
            </li>
            <li>Xem các chỉ số: Reputation, Violations, Banned Until.</li>
            <li>
              Xem số lượng file đã upload, tổng dung lượng, tên file gần nhất.
            </li>
            <li>Thông tin ví (wallet address) và vai trò hiển thị rõ ràng.</li>
          </ul>
          <Alert className="mt-2">
            <User className="h-4 w-4" />
            <AlertTitle>Profile Info</AlertTitle>
            <AlertDescription>
              Bạn cần kết nối ví để sử dụng đầy đủ chức năng profile.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Buy NFT Section */}
      <Card id="buy" className="mb-8">
        <CardHeader>
          <CardTitle>Buy NFT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Trang <b>Buy</b> cho phép bạn duyệt và mua các bộ sưu tập NFT đang
            được niêm yết.
          </p>
          <ul className="list-disc pl-6">
            <li>Xem danh sách các collection NFT đang bán.</li>
            <li>Nhấn vào từng collection để xem chi tiết và mua NFT.</li>
            <li>Trang hỗ trợ realtime update khi có collection mới.</li>
            <li>
              Có thể load thêm nhiều collection bằng nút <b>Load more</b>.
            </li>
          </ul>
          <Alert className="mt-2">
            <ShoppingBag className="h-4 w-4" />
            <AlertTitle>NFT Marketplace</AlertTitle>
            <AlertDescription>
              Bạn cần kết nối ví để mua và sở hữu NFT.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Events Section */}
      <Card id="events" className="mb-8">
        <CardHeader>
          <CardTitle>Events & Competitions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Trang <b>Events</b> giúp bạn đăng ký, theo dõi các sự kiện, cuộc
            thi, và xem lịch sự kiện.
          </p>
          <ul className="list-disc pl-6">
            <li>
              Chuyển tab giữa <b>Sự kiện</b> và <b>Cuộc thi</b>.
            </li>
            <li>Đăng ký tham gia sự kiện/cuộc thi, xem trạng thái đăng ký.</li>
            <li>Xem lịch sự kiện, các sự kiện đã đăng ký, đã tham gia.</li>
            <li>Tạo mới sự kiện/cuộc thi (nếu có quyền).</li>
            <li>
              Thông báo realtime khi có sự kiện mới hoặc có người đăng ký.
            </li>
          </ul>
          <Alert className="mt-2">
            <Calendar className="h-4 w-4" />
            <AlertTitle>Event Notice</AlertTitle>
            <AlertDescription>
              Một số sự kiện/thi có thể yêu cầu xác thực hoặc điều kiện đặc
              biệt.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Q&A Section */}
      <Card id="question" className="mb-8">
        <CardHeader>
          <CardTitle>Q&A Arena</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Trang <b>Q&A</b> là nơi bạn có thể đặt câu hỏi, trả lời, vote, lưu
            câu hỏi, và nhận thưởng token.
          </p>
          <ul className="list-disc pl-6">
            <li>
              Đặt câu hỏi mới bằng nút <b>Ask Question</b>.
            </li>
            <li>Vote cho câu hỏi hay, trả lời để nhận token thưởng.</li>
            <li>Lưu câu hỏi yêu thích, xem lại các câu hỏi đã lưu.</li>
            <li>
              Xem stats: số câu hỏi, số câu trả lời, tổng token nhận được, badge
              level.
            </li>
          </ul>
          <Alert className="mt-2">
            <HelpCircle className="h-4 w-4" />
            <AlertTitle>Q&A Tips</AlertTitle>
            <AlertDescription>
              Hãy đóng góp câu hỏi và trả lời chất lượng để nhận nhiều token
              hơn!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Token/NFT Section */}
      <Card id="token" className="mb-8">
        <CardHeader>
          <CardTitle>NFT & Token Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Trang <b>NFT/Token</b> cho phép bạn xem chi tiết NFT, thuộc tính,
            chủ sở hữu, file đính kèm, và các hành động liên quan.
          </p>
          <ul className="list-disc pl-6">
            <li>
              Xem thông tin NFT: hình ảnh, tên, token ID, thuộc tính, mô tả.
            </li>
            <li>Xem chủ sở hữu hiện tại, avatar hoặc Blobbie.</li>
            <li>Tải hoặc xem trước file đính kèm (nếu là chủ sở hữu).</li>
            <li>Xem lịch sử sự kiện liên quan đến NFT.</li>
          </ul>
          <Alert className="mt-2">
            <Tag className="h-4 w-4" />
            <AlertTitle>NFT/Token Info</AlertTitle>
            <AlertDescription>
              Một số file đính kèm chỉ chủ sở hữu mới có thể tải hoặc xem trước.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* File Management Section */}
      <Card id="file" className="mb-8">
        <CardHeader>
          <CardTitle>File Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Trang <b>File</b> cho phép bạn quản lý các file cá nhân: upload,
            xem, tải, xóa file, và chuyển đổi giữa các chế độ hiển thị danh
            sách.
          </p>
          <ul className="list-disc pl-6">
            <li>
              Upload file mới bằng nút <b>Upload File</b>, có thể đặt lại tên
              file trước khi upload.
            </li>
            <li>
              Xem file trực tiếp trên web (nếu hỗ trợ), tải file về máy, hoặc
              xóa file khỏi hệ thống.
            </li>
            <li>
              Chuyển đổi giữa chế độ phân trang (pagination) và danh sách (list
              view) để duyệt file dễ dàng.
            </li>
            <li>
              Bảng file hiển thị tên, dung lượng, ngày tạo, và các thao tác
              nhanh.
            </li>
            <li>
              File được lưu trữ bảo mật, chỉ bạn mới có thể xem/tải file của
              mình.
            </li>
          </ul>
          <Alert className="mt-2">
            <File className="h-4 w-4" />
            <AlertTitle>File Security</AlertTitle>
            <AlertDescription>
              Hãy đặt tên file rõ ràng và không chia sẻ file nhạy cảm cho người
              khác. File của bạn được bảo mật trên hệ thống.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-xs text-gray-400">
        Last updated: 6/4/2025
      </div>
    </div>
  );
}
