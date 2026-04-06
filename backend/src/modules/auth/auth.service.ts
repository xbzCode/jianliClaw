import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/config/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 用户注册
  async register(dto: RegisterDto) {
    // 验证两次密码是否一致
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('两次密码输入不一致');
    }

    // 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        nickname: dto.nickname || dto.email.split('@')[0],
      },
    });

    // 生成token
    const accessToken = this.generateToken(user.id, user.email);

    // 创建会话
    await this.createSession(user.id, accessToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  // 用户登录
  async login(dto: LoginDto) {
    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 生成token
    const accessToken = this.generateToken(user.id, user.email);

    // 创建会话
    await this.createSession(user.id, accessToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  // 获取用户信息
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        nickname: true,
        avatar: true,
        modelPreference: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return user;
  }

  // 生成JWT Token
  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  // 创建会话
  private async createSession(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天后过期

    await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  // 验证Token
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const session = await this.prisma.session.findFirst({
        where: {
          token,
          userId: payload.sub,
          expiresAt: { gt: new Date() },
        },
      });

      return session ? payload : null;
    } catch {
      return null;
    }
  }
}
