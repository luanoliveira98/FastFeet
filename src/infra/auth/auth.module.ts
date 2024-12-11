import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { EnvModule } from '../env/env.module'
import { JwtModule } from '@nestjs/jwt'
import { EnvService } from '../env/env.service'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './guard/jwt-auth.guard'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY')
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          signOptions: { algorithm: 'RS256', expiresIn: '1h' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, JwtStrategy],
})
export class AuthModule {}
