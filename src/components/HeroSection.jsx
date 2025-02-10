import React, { useEffect, useRef, useState } from "react";
import { FaComment, FaRegImage, FaRegSmile, FaShare, FaThumbsUp, FaVideo } from "react-icons/fa";
import { useUser } from "../context/userContext";
import { toast } from "react-toastify";
import { addDocument, getDocument, updateDocument } from "../utils/firebasehelpers";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import PostCardSkeleton from "./PostCardSkeleton";

const HeroSection = () => {
    const { user } = useUser()
    const postInput = useRef()
    const [postData, setPostData] = useState()
    const [postImage, setPostImage] = useState(null)
    const [postLoading, setPostLoading] = useState(false)
    const [addPostLoading, setAddPostLoading] = useState(false)


    useEffect(() => {
        const getPost = async () => {
            const data = []
            setPostLoading(true)
            try {
                const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    data.push({ docID: doc.id, ...doc.data() })
                    // console.log(doc.id, " => ", doc.data());
                });
            } catch (error) {
                console.log(error)
            } finally {
                setPostLoading(false)
            }
            setPostData([...data])
            console.log(data)
        }
        getPost()
    }, [])

    const uploadImage = () => {
        var myWidget = cloudinary.createUploadWidget({
            cloudName: 'dvmyemrlc',
            uploadPreset: 'expertizo-hackthon',
            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'],
            multiple: false, sources: ['local', 'url', 'camera'],
            resourceType: 'image'
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                // console.log('Done! Here is the image info: ', result.info);
                setPostImage(result.info.secure_url)
                console.log(result.info.secure_url)
            }
        }
        )
        myWidget.open()
    }

    const createPost = async () => {
        if (!postInput.current.value) return toast.error("Please enter a post content")
        setAddPostLoading(true)
        const postItem = {
            content: postInput.current.value,
            author: user.displayName,
            timestamp: Date.now(),
            authorImage: user.photoURL,
            likes: [],
            comments: [],
            postImage: postImage || null
        }
        console.log(postItem)
        console.log(user)
        try {
            const data = await addDocument("posts", postItem)
            console.log(data)
            setPostData([data, ...postData])
        } catch (error) {
            console.log(error)
        } finally {
            setAddPostLoading(false)
        }
        postInput.current.value = ""
        setPostImage(null)
    }

    const likePost = async (post) => {
        const updatedLikes = post.likes.includes(user.uid) ? post.likes.filter(like => like != user.uid) : [...post.likes, user.uid]
        const updatedPost = { ...post, likes: updatedLikes }
        console.log("updatedPost", updatedPost)
        //For state update
        setPostData((prevData) =>
            prevData.map((item) =>
                item.docID === updatedPost.docID ? updatedPost : item
            )
        );
        try {
            const res = await updateDocument("posts", post.docID, updatedPost)
            console.log(res)
        } catch (error) {
            console.log(error)
        }

    }

    const addComment = async (post, e) => {
        e.preventDefault()
        if (!e.target.comment.value.length) return toast.error("Please enter a comment")
        const newComment = {
            author: user.displayName,
            authorImage: user.photoURL,
            timestamp: Date.now(),
            content: e.target.comment.value
        }
        post.comments.push(newComment)
        setPostData(prev => prev.map(item => item.docID === post.docID ? post : item))
        console.log("newComment", newComment)
        try {
            const res = await updateDocument("posts", post.docID, post)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
        e.target.comment.value = ""
    }

    return (
        <section className="p-4 flex-col flex-1 max-w-7xl bg-gray-50">
            {/* What's Happening Box */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex items-start space-x-3">
                    <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover" />
                    <textarea
                        ref={postInput}
                        placeholder="What's happening?"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows="3"
                    ></textarea>
                </div>
                {postImage && <div className="overflow-hidden  ml-12 mt-2">
                    <img src={postImage} className="w-[200px] rounded-md" alt="" />
                </div>}
                <div className="flex items-center flex-wrap justify-between mt-3">
                    <div className="flex space-x-4 text-gray-500">
                        <label className="flex items-center space-x-1 cursor-pointer">
                            <FaVideo />
                            <span>Live video</span>
                        </label>
                        <label onClick={uploadImage} className="flex items-center space-x-1 cursor-pointer">
                            <FaRegImage />
                            <span className={postImage && "bg-primary text-white rounded-full py-1 px-2"}>Photos</span>
                        </label>
                        <label className="flex items-center space-x-1 cursor-pointer">
                            <FaRegSmile />
                            <span>Feeling</span>
                        </label>
                    </div>
                    <button disabled={addPostLoading} className="bg-primary text-white px-4 py-2 flex gap-1 rounded-lg mt-2 disabled:opacity-75 hover:bg-cyan-600 w-full md:w-auto  cursor-pointer" onClick={createPost}>{addPostLoading && <div role="status">
                        <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-300 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>} Post</button>
                </div>
            </div>


            {postLoading && <PostCardSkeleton />}
            {/* Post Section */}
            {postData && postData.map(item => (
                <div key={item.docID} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <img src={item.authorImage} alt="User" className="w-10 h-10 object-cover rounded-full" />
                        <div>
                            <p className="font-semibold text-gray-800">{item.author}</p>
                            <p className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    {item.postImage && <div className="flex justify-center mb-3">
                        <img src={item.postImage} alt="Post" className="w-[390px] h-[300px] object-cover rounded-lg" />
                    </div>}
                    <p className="text-gray-800 mb-3">{item.content}</p>
                    <div className="flex items-center mx-3 md:mx-10 justify-between text-gray-500">
                        {/* <div className="flex space-x-4"> */}
                        <span
                            onClick={() => likePost(item)}
                            className="flex gap-2"
                        >{item.likes.length != 0 && item.likes.length} <FaThumbsUp size={20} color={item.likes.includes(user.uid) ? "#1AA3E8" : ""} className="cursor-pointer" /></span>
                        <span className="flex gap-2">{item.comments.length != 0 && item.comments.length} <FaComment size={20} className="cursor-pointer" /></span>
                        <FaShare size={20} className="cursor-pointer" />
                        {/* </div> */}
                    </div>
                    <form onSubmit={(e) => addComment(item, e)} className="mt-3 relative">
                        <input
                            // ref={commentInput}
                            type="text"
                            name="comment"
                            placeholder="Write a comment..."
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button

                            className="bg-primary text-sm absolute right-2 top-2 text-white px-2 py-1 rounded-sm ml-2 cursor-pointer">Comment</button>
                    </form>
                    {item.comments && item.comments.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {item.comments.map((comment, idx) => (
                                <div key={idx} className="flex items-center bg-gray-100 rounded-md px-3 space-x-3">
                                    <img
                                        src={comment.authorImage}
                                        alt={comment.author}
                                        className="w-8 h-8 border-gray-600 border rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">{comment.author}</p>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
};

export default HeroSection;
