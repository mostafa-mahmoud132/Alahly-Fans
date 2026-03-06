
import React from 'react'
import { useParams } from 'react-router-dom'
import usePosts from '../../customHooks/usePosts'
import PostCard from '../../Components/postCard/postCard'
import PostCardLoadingSkeleton from '../../Components/postCard/PostCardSkeleton/PostCardSkeleton'
import AddComment from '../../Components/AddComment/AddComment'
import Comment from '../../Components/Comment/Comment'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getHeaders } from '../../helper/HeadersObj'

export default function PostDetails() {
  const { id } = useParams()
  const { data, isLoading, isFetched } = usePosts(
    ["details", id],
    true,
    `posts/${id}`
  )


  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['postComments', id],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=50`,
          getHeaders()
        )
        return data.data
      } catch (err) {
        console.error("Error fetching comments:", err)
        return []
      }
    },
    enabled: Boolean(id)
  })

  return (
    <>
      <title>Post Details</title>
      <div className="container mx-auto p-5 mt-20">
        {isLoading && <PostCardLoadingSkeleton />}

        {!isLoading && isFetched && (!data || !data.post) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center mt-5">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Post Not Found</h2>
            <p className="text-gray-500">This post may have been deleted or is no longer available.</p>
          </div>
        )}

        {isFetched && data?.post && (
          <>
            <PostCard post={data.post} />

            <div className="comments-section mt-5 flex flex-col gap-3">
              {commentsLoading ? (
                <p className="text-gray-500 text-center py-4">Loading comments...</p>
              ) : (
                <>
                  <div className="comments-list flex flex-col gap-3">
                    {commentsData?.comments?.length > 0 ? (
                      commentsData.comments.map((comment) => (
                        <Comment
                          key={comment._id}
                          comment={comment}
                          activePostId={data.post._id}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center p-4 bg-slate-50 rounded-lg">No comments yet.</p>
                    )}
                  </div>

              
                  <div className="mt-3">
                    <AddComment activePostId={data.post._id} />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}