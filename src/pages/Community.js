import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

function Community({ isAuth }) {
  const deleteIcon = <FontAwesomeIcon icon={faTrash} />;
  const navigate = useNavigate();
  const [postLists, setPostLists] = useState([]);
  const [postDelete,setPostDelete] = useState(false);
  const [likeUpdate,setLikeUpdate] = useState(false);
  const postsCollectionRef = collection(db, "posts");
  
  const deletePost = async (postID) => {
    const postDoc = doc(db, "posts", postID);
    await deleteDoc(postDoc);
    setPostDelete(!postDelete);
    console.log("deletePost Called");
  };


  const updateLike = async (id, likes) => {
    const docRef = doc(db, "posts", id);

    if(likes.hasOwnProperty(auth.currentUser.uid)){
      const currUser = auth.currentUser.uid;
      delete likes[currUser];
      const updateLike = {likes: likes};
      await updateDoc(docRef,updateLike);
    }
    else{
      likes[auth.currentUser.uid]="1"
      const updateLikes = {likes:likes};
      await updateDoc(docRef,updateLikes);
      
    }

    setLikeUpdate(!likeUpdate);
    console.log("updateLike called");
  };

  
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log("community useEffect called");
    };
    getPosts();
  }, [postDelete, likeUpdate]);

  return (
    <>
      <div className="community-header">
        <h1>Happy Connecting</h1>
        <button
          className="create-comm-post-btn"
          onClick={() => {
            isAuth ? navigate("/create-comm-post") : navigate("/login");
          }}
        >
          Create Post
        </button>
      </div>
      <div className="community-posts">
        {postLists.map((post) => {
          return (
            <div className="community-post">
              <h2 className="comm-post-title">{post.title}</h2>

              <p className="comm-post-body">{post.postText}</p>
              <div className="post-footer">
                <p className="post-author">@{post.author.name}</p>
                <button
                  className="like"
                  onClick={() => {
                    updateLike(post.id, post.likes);
                  }}
                >
                  {post.likes.hasOwnProperty(auth.currentUser.uid)?<button className="like-button">❤️{Object.keys(post.likes).length}</button>:<button className="like-button">🤍{Object.keys(post.likes).length}</button>}
                </button>
                {isAuth && auth.currentUser.uid === post.author.id && (
                  <button
                    className="delete-button"
                    onClick={() => {
                      deletePost(post.id);
                    }}
                  >
                    {deleteIcon}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Community;
