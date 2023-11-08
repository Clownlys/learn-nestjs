import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { SessionService } from './session/session.service';

@Controller()
export class AppController {
  @Inject(SessionService)
  private sessionService: SessionService;
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('count')
  async getCount(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sid = req.cookies?.sid;

    const session = await this.sessionService.getSession<{ count: string }>(
      sid,
    );
    const curCount = session.count ? parseInt(session.count) + 1 : 1;
    const curSid = await this.sessionService.setSession(sid, {
      count: curCount,
    });
    res.cookie('sid', curSid, { maxAge: 1000 * 60 * 60 * 24 * 30 });
    return curCount;
  }
}
