import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const id = request.nextUrl.searchParams.get('id');
	if (!id) {
		return NextResponse.json({ code: -1 });
	}
	// 删除消息
	const deleteMessages = prisma.message.deleteMany({
		where: {
			chatId: id,
		},
	});
	// 删除列表
	const deleteChat = prisma.chat.delete({
		where: {
			id,
		},
	});
	// 这里借助$transaction  保证二者同时失败同时成功
	await prisma.$transaction([deleteMessages, deleteChat]);
	return NextResponse.json({ code: 0 });
}
