import { ApiProperty } from '@nestjs/swagger';

export class ChatReplyResDto {
  @ApiProperty({
    description: 'Câu trả lời từ chatbot',
    example: 'Xin chào! Mình là trợ lý ảo Nova Cinema 🎬',
  })
  reply!: string;
}
