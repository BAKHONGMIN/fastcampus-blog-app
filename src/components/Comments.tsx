import React, { useContext, useState } from "react";
import { CommentsInterface, PostProps } from "./PostList";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";
import { db } from "firebaseApp";

interface CommentsProps {
  post: PostProps;
  getPost: (id: string) => Promise<void>;
}

export default function Comments({ post, getPost }: CommentsProps) {
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "comment") {
      setComment(value);
    }
  };

  const onSumit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (post && post?.id) {
        const postRef = doc(db, "posts", post.id);

        if (user?.uid) {
          const commentObj = {
            content: comment,
            uid: user.uid,
            createAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          };

          await updateDoc(postRef, {
            comments: arrayUnion(commentObj),
            updateDated: new Date().toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          });
          // 문서 업데이트
          await getPost(post?.id);
        }
      }
      toast.success("댓글을 생성했습니다.");
      setComment("");
    } catch (e: any) {
      console.log(e);
      toast.error(e?.code);
    }
  };

  const handleDeleteComment = async (data: CommentsInterface) => {
    const confirm = window.confirm("해당 댓글을 삭제하시겠습니까?");

    if (confirm && post.id) {
      const postRef = doc(db, "posts", post.id);

      await updateDoc(postRef, {
        comments: arrayRemove(data),
      });

      toast.success("댓글을 삭제했습니다.");

      //문서 업데이트
      await getPost(post.id);
    }
  };

  return (
    <div className="comments">
      <form onSubmit={onSumit} className="comments__form">
        <div className="form__block">
          <label htmlFor="comment">댓글 입력</label>
          <textarea
            name="comment"
            id="comment"
            required
            value={comment}
            onChange={onChange}
          ></textarea>
        </div>
        <div className="form__block form__block-reverse">
          <input type="submit" value="입력" className="form__btn-submit" />
        </div>
      </form>
      <div className="comments__list">
        {post?.comments
          ?.slice(0)
          .reverse()
          .map((item) => (
            <div key={item?.createAt} className="comments__box">
              <div className="comments__profile-box">
                <div className="comment__email">{item?.email}</div>
                <div className="comment__date">{item?.createAt}</div>
                {item.uid === user?.uid && (
                  <div
                    className="comment__delete"
                    onClick={() => handleDeleteComment(item)}
                  >
                    삭제
                  </div>
                )}
              </div>
              <div className="comment__text">{item?.content}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
