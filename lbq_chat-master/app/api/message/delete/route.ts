import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	// 获取参数路径的ID参数
	const id = request.nextUrl.searchParams.get('id');
	// 如果没有ID则直接返回报错
	if (!id) {
		return NextResponse.json({ code: -1, data: { message: 'Invalid' } });
	}
	await prisma.message.delete({
		where: {
			id,
		},
	});
	return NextResponse.json({ code: 0, data: { message: '删除成功' } });
}
