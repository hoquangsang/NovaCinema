import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MovieService } from 'src/modules/movies';
import { TheaterService } from 'src/modules/theaters';
import { ShowtimeService } from 'src/modules/showtimes';
import { PricingConfigService } from 'src/modules/pricing-configs';
import { DateUtil } from 'src/common/utils';
import { CINEMA_INFO, RULE_BASED_KEYWORDS } from '../data/cinema-data.constant';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly genAI: GoogleGenerativeAI | null;
  private readonly model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null;

  constructor(
    private readonly configService: ConfigService,
    private readonly movieService: MovieService,
    private readonly theaterService: TheaterService,
    private readonly showtimeService: ShowtimeService,
    private readonly pricingConfigService: PricingConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      this.logger.warn('GEMINI_API_KEY not configured, AI features disabled');
      this.genAI = null;
      this.model = null;
    }
  }

  /**
   * Xử lý tin nhắn người dùng với cơ chế Hybrid:
   * 1. Rule-based (ưu tiên): Kiểm tra keywords
   * 2. AI Gemini (fallback): Nếu không match keyword
   */
  async processMessage(userMessage: string): Promise<string> {
    const normalizedMessage = userMessage.toLowerCase().trim();

    // Priority 1: Rule-based responses
    const ruleBasedResponse = await this.checkRuleBasedResponse(normalizedMessage);
    if (ruleBasedResponse) {
      return ruleBasedResponse;
    }

    // Priority 2: AI Gemini response
    return this.getAIResponse(userMessage);
  }

  /**
   * Kiểm tra và trả về response theo rule-based (keyword matching)
   */
  private async checkRuleBasedResponse(message: string): Promise<string | null> {
    // Giá vé
    if (this.matchKeywords(message, RULE_BASED_KEYWORDS.PRICE)) {
      return this.getPriceResponse();
    }

    // Địa chỉ rạp
    if (this.matchKeywords(message, RULE_BASED_KEYWORDS.ADDRESS)) {
      return this.getAddressResponse();
    }

    // Lịch chiếu
    if (this.matchKeywords(message, RULE_BASED_KEYWORDS.SHOWTIME)) {
      return this.getShowtimeResponse();
    }

    // Phim đang chiếu
    if (this.matchKeywords(message, RULE_BASED_KEYWORDS.MOVIES)) {
      return this.getMoviesResponse();
    }

    // Liên hệ/Hỗ trợ
    if (this.matchKeywords(message, RULE_BASED_KEYWORDS.CONTACT)) {
      return this.getContactResponse();
    }

    // Lời chào
    if (this.matchKeywords(message, RULE_BASED_KEYWORDS.GREETING)) {
      return this.getGreetingResponse();
    }

    return null;
  }

  private matchKeywords(message: string, keywords: readonly string[]): boolean {
    return keywords.some((keyword) => message.includes(keyword));
  }

  // ==================== RULE-BASED RESPONSES ====================

  private async getPriceResponse(): Promise<string> {
    try {
      const pricing = await this.pricingConfigService.findPricingConfig();
      if (!pricing) {
        return `💰 **Bảng giá vé Nova Cinema:**

- Ghế thường: ${CINEMA_INFO.DEFAULT_PRICES.STANDARD.toLocaleString('vi-VN')}đ
- Ghế VIP: ${CINEMA_INFO.DEFAULT_PRICES.VIP.toLocaleString('vi-VN')}đ
- Ghế đôi (Couple): ${CINEMA_INFO.DEFAULT_PRICES.COUPLE.toLocaleString('vi-VN')}đ

📍 Giá có thể thay đổi vào cuối tuần và ngày lễ.
🎟️ Đặt vé ngay tại website hoặc app để nhận ưu đãi!`;
      }

      const { basePrice, modifiers } = pricing;
      let priceInfo = `💰 **Bảng giá vé Nova Cinema:**\n\n`;
      priceInfo += `- Giá cơ bản: ${basePrice.toLocaleString('vi-VN')}đ\n`;

      if (modifiers.seatTypes.length > 0) {
        priceInfo += `\n**Phụ thu theo loại ghế:**\n`;
        modifiers.seatTypes.forEach(({ seatType, deltaPrice }) => {
          const sign = deltaPrice >= 0 ? '+' : '';
          priceInfo += `- ${seatType}: ${sign}${deltaPrice.toLocaleString('vi-VN')}đ\n`;
        });
      }

      if (modifiers.roomTypes.length > 0) {
        priceInfo += `\n**Phụ thu theo loại phòng:**\n`;
        modifiers.roomTypes.forEach(({ roomType, deltaPrice }) => {
          const sign = deltaPrice >= 0 ? '+' : '';
          priceInfo += `- ${roomType}: ${sign}${deltaPrice.toLocaleString('vi-VN')}đ\n`;
        });
      }

      if (modifiers.daysOfWeek.length > 0) {
        priceInfo += `\n**Phụ thu/giảm theo ngày:**\n`;
        modifiers.daysOfWeek.forEach(({ dayOfWeek, deltaPrice }) => {
          const sign = deltaPrice >= 0 ? '+' : '';
          priceInfo += `- ${dayOfWeek}: ${sign}${deltaPrice.toLocaleString('vi-VN')}đ\n`;
        });
      }

      priceInfo += `\n🎟️ Đặt vé ngay tại website để nhận ưu đãi!`;
      return priceInfo;
    } catch (error) {
      this.logger.error('Error fetching pricing:', error);
      return `💰 **Bảng giá vé Nova Cinema:**

- Ghế thường: ${CINEMA_INFO.DEFAULT_PRICES.STANDARD.toLocaleString('vi-VN')}đ
- Ghế VIP: ${CINEMA_INFO.DEFAULT_PRICES.VIP.toLocaleString('vi-VN')}đ
- Ghế đôi (Couple): ${CINEMA_INFO.DEFAULT_PRICES.COUPLE.toLocaleString('vi-VN')}đ

🎟️ Đặt vé ngay tại website để nhận ưu đãi!`;
    }
  }

  private async getAddressResponse(): Promise<string> {
    try {
      const theaters = await this.theaterService.findTheaters({ isActive: true });
      if (!theaters || theaters.length === 0) {
        return `📍 **Hệ thống rạp Nova Cinema:**

${CINEMA_INFO.THEATERS.map((t, i) => `${i + 1}. **${t.name}**
   📍 ${t.address}
   📞 ${t.hotline}`).join('\n\n')}

🚗 Quý khách vui lòng đến trước giờ chiếu 15-30 phút!`;
      }

      let response = `📍 **Hệ thống rạp Nova Cinema:**\n\n`;
      theaters.forEach((theater, index) => {
        response += `${index + 1}. **${theater.theaterName}**\n`;
        if (theater.address) response += `   📍 ${theater.address}\n`;
        if (theater.hotline) response += `   📞 ${theater.hotline}\n`;
        response += `   🎬 ${theater.roomsCount} phòng chiếu\n\n`;
      });

      response += `🚗 Quý khách vui lòng đến trước giờ chiếu 15-30 phút!`;
      return response;
    } catch (error) {
      this.logger.error('Error fetching theaters:', error);
      return `📍 **Hệ thống rạp Nova Cinema:**

${CINEMA_INFO.THEATERS.map((t, i) => `${i + 1}. **${t.name}**
   📍 ${t.address}
   📞 ${t.hotline}`).join('\n\n')}

🚗 Quý khách vui lòng đến trước giờ chiếu 15-30 phút!`;
    }
  }

  private async getShowtimeResponse(): Promise<string> {
    return `🎬 **Xem lịch chiếu phim tại Nova Cinema:**

Để xem lịch chiếu chi tiết, quý khách có thể:

1. 🌐 Truy cập trang web và chọn mục "Lịch chiếu"
2. 📱 Sử dụng app Nova Cinema
3. 🎫 Chọn phim yêu thích → Xem suất chiếu → Đặt vé

💡 **Tip:** Đặt vé online để chọn được ghế đẹp nhất!

Bạn cần tìm lịch chiếu phim cụ thể nào không? Hãy cho mình biết tên phim nhé! 🎥`;
  }

  private async getMoviesResponse(): Promise<string> {
    try {
      const result = await this.movieService.findShowingMoviesPaginated({
        page: 1,
        limit: 5,
      });

      if (!result.items || result.items.length === 0) {
        return `🎬 **Phim đang chiếu tại Nova Cinema:**

Hiện tại chưa có thông tin phim. Vui lòng truy cập website để xem danh sách phim mới nhất!

🌐 Website: ${CINEMA_INFO.WEBSITE}`;
      }

      let response = `🎬 **Phim đang chiếu tại Nova Cinema:**\n\n`;
      result.items.forEach((movie, index) => {
        response += `${index + 1}. **${movie.title}**\n`;
        if (movie.genres && movie.genres.length > 0) {
          response += `   🎭 ${movie.genres.join(', ')}\n`;
        }
        if (movie.duration) {
          response += `   ⏱️ ${movie.duration} phút\n`;
        }
        if (movie.ratingAge) {
          response += `   🔞 ${movie.ratingAge}\n`;
        }
        response += '\n';
      });

      if (result.total > 5) {
        response += `... và ${result.total - 5} phim khác!\n\n`;
      }

      response += `🎟️ Đặt vé ngay tại website để chọn ghế đẹp!`;
      return response;
    } catch (error) {
      this.logger.error('Error fetching movies:', error);
      return `🎬 **Phim đang chiếu tại Nova Cinema:**

Vui lòng truy cập website để xem danh sách phim mới nhất!

🌐 Website: ${CINEMA_INFO.WEBSITE}`;
    }
  }

  private getContactResponse(): string {
    return `📞 **Liên hệ Nova Cinema:**

🌐 **Website:** ${CINEMA_INFO.WEBSITE}
📧 **Email:** ${CINEMA_INFO.EMAIL}
📞 **Hotline:** ${CINEMA_INFO.HOTLINE}
⏰ **Thời gian hỗ trợ:** ${CINEMA_INFO.SUPPORT_HOURS}

💬 Bạn cũng có thể chat trực tiếp với mình để được hỗ trợ!
Mình sẵn sàng giúp bạn 24/7 🤖✨`;
  }

  private getGreetingResponse(): string {
    const greetings = [
      `Xin chào! 👋 Mình là trợ lý ảo của Nova Cinema 🎬\n\nMình có thể giúp bạn:\n• 🎟️ Thông tin giá vé\n• 📍 Địa chỉ các rạp\n• 🎬 Phim đang chiếu\n• 📞 Thông tin liên hệ\n\nBạn cần hỗ trợ gì nào? 😊`,
      `Chào bạn! 🌟 Rất vui được gặp bạn!\n\nMình là chatbot Nova Cinema, sẵn sàng hỗ trợ bạn tìm phim hay và đặt vé nhanh chóng!\n\nHãy hỏi mình bất cứ điều gì về rạp phim nhé! 🎥🍿`,
      `Hello! 🎉 Chào mừng đến với Nova Cinema!\n\nMình có thể giúp bạn tra cứu lịch chiếu, giá vé, hoặc thông tin về các bộ phim đang HOT!\n\nBạn muốn biết gì nào? 🎬✨`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // ==================== AI GEMINI RESPONSE ====================

  private async getAIResponse(userMessage: string): Promise<string> {
    if (!this.model) {
      return `Xin lỗi bạn, mình chưa hiểu rõ câu hỏi. 🤔

Bạn có thể hỏi mình về:
• 💰 Giá vé
• 📍 Địa chỉ rạp
• 🎬 Phim đang chiếu
• 📞 Liên hệ hỗ trợ

Hoặc thử hỏi lại với từ khóa cụ thể hơn nhé! 😊`;
    }

    try {
      // Lấy dữ liệu context từ database
      const context = await this.buildAIContext();

      const systemPrompt = `Bạn là trợ lý ảo của Nova Cinema - hệ thống rạp chiếu phim hiện đại.

HƯỚNG DẪN:
- Trả lời thân thiện, tự nhiên, sử dụng emoji phù hợp
- CHỈ trả lời dựa trên thông tin được cung cấp bên dưới
- Nếu không có thông tin, hướng dẫn người dùng liên hệ hotline hoặc website
- Trả lời ngắn gọn, tối đa 200 từ
- Sử dụng tiếng Việt

THÔNG TIN HỆ THỐNG:
${context}`;

      const result = await this.model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        systemInstruction: systemPrompt,
      });

      const response = result.response.text();
      return response || this.getFallbackResponse();
    } catch (error) {
      this.logger.error('AI generation error:', error);
      return this.getFallbackResponse();
    }
  }

  private async buildAIContext(): Promise<string> {
    const contextParts: string[] = [];

    // Thông tin rạp
    try {
      const theaters = await this.theaterService.findTheaters({ isActive: true });
      if (theaters && theaters.length > 0) {
        contextParts.push('DANH SÁCH RẠP:');
        theaters.forEach((t) => {
          contextParts.push(`- ${t.theaterName}: ${t.address || 'N/A'}, Hotline: ${t.hotline || 'N/A'}, ${t.roomsCount} phòng chiếu`);
        });
      }
    } catch (e) {
      this.logger.warn('Failed to fetch theaters for AI context');
    }

    // Thông tin phim đang chiếu
    try {
      const movies = await this.movieService.findShowingMoviesPaginated({ page: 1, limit: 10 });
      if (movies.items && movies.items.length > 0) {
        contextParts.push('\nPHIM ĐANG CHIẾU:');
        movies.items.forEach((m) => {
          const genres = m.genres?.join(', ') || 'N/A';
          contextParts.push(`- ${m.title}: Thể loại ${genres}, ${m.duration} phút, Độ tuổi: ${m.ratingAge || 'Mọi lứa tuổi'}`);
        });
      }
    } catch (e) {
      this.logger.warn('Failed to fetch movies for AI context');
    }

    // Thông tin giá vé
    try {
      const pricing = await this.pricingConfigService.findPricingConfig();
      if (pricing) {
        contextParts.push(`\nGIÁ VÉ: Giá cơ bản ${pricing.basePrice.toLocaleString('vi-VN')}đ, có phụ thu theo loại ghế và ngày trong tuần`);
      }
    } catch (e) {
      this.logger.warn('Failed to fetch pricing for AI context');
    }

    // Thông tin liên hệ
    contextParts.push(`\nLIÊN HỆ: Website ${CINEMA_INFO.WEBSITE}, Email ${CINEMA_INFO.EMAIL}, Hotline ${CINEMA_INFO.HOTLINE}`);

    return contextParts.join('\n');
  }

  private getFallbackResponse(): string {
    return `Xin lỗi bạn, mình đang gặp chút trục trặc. 🙏

Bạn có thể thử:
• Hỏi về **giá vé**, **địa chỉ rạp**, hoặc **phim đang chiếu**
• Liên hệ hotline: ${CINEMA_INFO.HOTLINE}
• Truy cập website: ${CINEMA_INFO.WEBSITE}

Mình sẽ cố gắng hỗ trợ tốt hơn! 💪`;
  }
}
