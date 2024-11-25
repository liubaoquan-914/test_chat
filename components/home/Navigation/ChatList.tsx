import { groupByDate } from "@/utils/utils"
import { Chat } from "@/types/chat"
import { useMemo, useState, useEffect, useRef } from "react"
import ChatItem from "./ChatItem"
import { useEventBusContext, EventListener } from '@/components/EventBusContext'
import { useAppContext } from '@/components/AppContext'
import { ActionType } from '@/reducers/AppReducer'

export default function ChatList () {
  const [chatList, setChatList] = useState<Chat[]>([])
  const pageRef = useRef(1)
  const loadMoreRef = useRef(null)
  const hasMoreRef = useRef(false)
  const loadingRef = useRef(false)
  const { state: { selectedChat }, dispatch } = useAppContext()
  const groupList = useMemo(() => {
    return groupByDate(chatList)
  }, [chatList])
  const { subscribe, unsubscribe } = useEventBusContext()

  // 获取列表数据
  const getData = async () => {
    if (loadingRef.current) {
      return
    }
    loadingRef.current = true
    const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
      method: 'GET'
    })
    if (!response.ok) {
      alert('获取数据失败')
      loadingRef.current = false
      return;
    }
    const { data } = await response.json()
    hasMoreRef.current = data.hasMore
    if (pageRef.current === 1) {
      setChatList(data.list)
    } else {
      setChatList(list => list.concat(data.list))
    }
    pageRef.current++
    loadingRef.current = false
  }

  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {
    const callback: EventListener = () => {
      pageRef.current = 1;
      getData()
    }
    subscribe('fetchChatList', callback)
    return () => unsubscribe('fetchChatList', callback)
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let div = loadMoreRef.current;
    if (div) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current) {
          getData()
        }
      })
      observer.observe(div)
    }
    return () => {
      if (observer && div) {
        observer.unobserve(div)
      }
    }
  }, [loadMoreRef]);
  return (
    <div className='flex-1 mb-[48px] mt-2 flex flex-col overflow-y-auto'>
      {groupList.map(([date, list]) => {
        return (
          <div key={date}>
            <div className='sticky top-0 z-10 p-3 text-sm bg-gray-900 text-gray-500'>
              {date}
            </div>
            <ul>
              {list.map((item) => {
                const selected = selectedChat?.id === item.id
                return (
                  <ChatItem
                    key={item.id}
                    item={item}
                    selected={selected}
                    onSelected={(chat) => {
                      dispatch({ type: ActionType.UPDATE, field: 'selectedChat', value: chat })
                    }}
                  />
                )
              })}
            </ul>
          </div>
        )
      })}
      <div ref={loadMoreRef}>&nbsp;</div>
    </div>
  )
}