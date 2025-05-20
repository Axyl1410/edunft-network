export const SYSTEM_ADDRESSES = {
    TREASURY: " 0x3b3E7562C2f1706De66d2144C81A32DAB6fFDc85", // Địa chỉ ví hệ thống
    REWARD_POOL: " 0x3b3E7562C2f1706De66d2144C81A32DAB6fFDc85", // Địa chỉ pool phần thưởng
    GOVERNANCE: " 0x3b3E7562C2f1706De66d2144C81A32DAB6fFDc85", // Địa chỉ governance
} as const;

export const CONTRACT_ADDRESSES = {
    QUESTION_REWARD: "0x5FbDB2315678afecb367f032d93F642f64180aa3 ", // Địa chỉ contract QuestionReward
} as const; 

// TREASURY (Ví hệ thống):
// Là ví chính của hệ thống
// Nhận 5% phí từ mỗi câu hỏi
// Dùng để duy trì và phát triển hệ thống
// Ví dụ: 0x123... (địa chỉ ví của team phát triển)
// REWARD_POOL (Pool phần thưởng):
// Là nơi chứa token để thưởng cho người dùng
// Có thể dùng để:
// Thưởng cho người dùng tích cực
// Tổ chức các sự kiện
// Khuyến khích người dùng mới
// Ví dụ: 0x456... (địa chỉ ví chứa token thưởng)
// GOVERNANCE (Quản trị):
// Là địa chỉ có quyền quản trị hệ thống
// Có thể:
// Thay đổi các thông số của hệ thống
// Quản lý danh sách blacklist
// Đề xuất và thực hiện các thay đổi
// Ví dụ: 0x789... (địa chỉ ví của admin)
// QUESTION_REWARD (Contract chính):
// Là địa chỉ của smart contract QuestionReward
// Được tạo sau khi deploy contract
// Dùng để tương tác với contract từ frontend
// Ví dụ: 0xabc... (địa chỉ contract sau khi deploy)