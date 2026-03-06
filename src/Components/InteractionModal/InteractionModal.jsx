import { Modal, ModalHeader, ModalBody } from 'flowbite-react';
import React, { useContext } from 'react';
import FollowButton from '../FollowButton/FollowButton';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function InteractionModal({ isOpen, onClose, title, users, isLoading }) {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const followingIds = userData?.following?.map(f => f._id || f) || [];

  return (
    <Modal show={isOpen} onClose={onClose} size="md" popup dismissible position="center">
      <ModalHeader className="border-b border-gray-100 px-4 py-3">
        <span className="text-lg font-bold text-gray-900">{title}</span>
      </ModalHeader>
      <ModalBody className="p-2 pt-4">
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto px-2 pb-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <span className="text-gray-500 font-medium">Loading...</span>
            </div>
          ) : users && users.length > 0 ? (
            users.map((user, index) => {
              const isFollowing = followingIds.includes(user._id);
              return (
                <div 
                  key={user._id || index} 
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                  onClick={() => {
                    onClose();
                    navigate(user._id === userData?._id ? '/profail' : `/user/${user._id}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.photo || 'https://via.placeholder.com/40'} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-900 hover:text-[#1f6fe5] transition-colors">{user.name}</span>
                      {user.username && (
                        <span className="text-xs text-gray-500">@{user.username}</span>
                      )}
                    </div>
                  </div>
                  <FollowButton 
                    userId={user._id} 
                    isInitialFollowing={isFollowing} 
                  />
                </div>
              );
            })
          ) : (
            <div className="text-center p-4">
              <span className="text-gray-500 font-medium">No {title.toLowerCase()} yet.</span>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
