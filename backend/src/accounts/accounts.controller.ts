import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.accountsService.findAllAccounts(req.user.id);
  }

  @Post()
  async create(@Request() req, @Body() data: any) {
    return this.accountsService.createAccount({
      ...data,
      userId: req.user.id,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.accountsService.updateAccount(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.accountsService.deleteAccount(id);
  }

  // Parent accounts
  @Get('parent')
  async findAllParents(@Request() req) {
    return this.accountsService.findAllParentAccounts(req.user.id);
  }

  @Post('parent')
  async createParent(@Request() req, @Body() data: any) {
    return this.accountsService.createParentAccount({
      ...data,
      userId: req.user.id,
    });
  }

  @Patch('parent/:id')
  async updateParent(@Param('id') id: string, @Body() data: any) {
    return this.accountsService.updateParentAccount(id, data);
  }

  @Delete('parent/:id')
  async deleteParent(@Param('id') id: string) {
    return this.accountsService.deleteParentAccount(id);
  }
}
