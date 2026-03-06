import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getHeaders } from '../../helper/HeadersObj'
import toast from 'react-hot-toast'
import NotificationSkeleton from '../../Components/NotificationSkeleton/NotificationSkeleton'

export default function Notifications() {
  const queryClient = useQueryClient()

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/notifications?page=1&limit=20`,
          
          getHeaders()
        )
        return data.data?.notifications || []
      } catch (err) {
        return []
      }
    }
  })

  const { mutate: markAllRead } = useMutation({
    mutationFn: async () => {
      await axios.patch(`https://route-posts.routemisr.com/notifications/read-all`, {}, getHeaders())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] })
      toast.success('All marked as read')
    }
  })

  const { mutate: markSingleRead } = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`https://route-posts.routemisr.com/notifications/${id}/read`, {}, getHeaders())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] })
    }
  })

  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-5 mt-20 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#00298d]">Notifications</h2>
        <button 
          onClick={markAllRead} 
          className="text-sm text-[#1f6fe5] hover:underline font-semibold"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <NotificationSkeleton />
        ) : notificationsData?.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {notificationsData.map((notif) => (
              <li 
                key={notif._id} 
                onClick={() => {
                  if (!notif.isRead) {
                    markSingleRead(notif._id)
                  }
                  if (notif.entityType === 'post' && notif.entityId) {
                    navigate(`/postDetails/${notif.entityId}`)
                  }
                }}
                className={`p-4 hover:bg-slate-50 transition cursor-pointer flex gap-4 items-start ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
              >
                <img src={notif.actor?.photo || 'https://via.placeholder.com/40'} alt="User" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div className="flex-1">
                  <p className="text-gray-800">
                    <span className="font-bold text-slate-900">{notif.actor?.name}</span>{' '}
                    {notif.type === 'like_post' ? 'liked your post.' :
                     notif.type === 'comment_post' ? 'commented on your post.' :
                     notif.message || 'interacted with your post.'}
                  </p>
                  <span className="text-xs font-medium text-slate-500 mt-1 block">
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                {!notif.isRead && <div className="w-2.5 h-2.5 rounded-full bg-[#1f6fe5] mt-2"></div>}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">No notifications yet.</div>
        )}
      </div>
    </div>
  )
}
