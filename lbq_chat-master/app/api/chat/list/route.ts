import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const param = request.nextUrl.searchParams.get('page');
	const page = param ? parseInt(param) : 1;
	// 分页查询
	const list = await prisma.chat.findMany({
		skip: (page - 1) * 20, // 查询第几页的数据
		take: 20, // 一次查询多少条
		orderBy: {
			updateTime: 'desc', // 按照更新时间降序排序
		},
	});
	const count = await prisma.chat.count();
	const hasMore = count > page * 20;
	return NextResponse.json({ code: 0, data: { list, hasMore } });
}
