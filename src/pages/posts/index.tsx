import Header from "components/Header";
import PostList from "components/PostList";
import React from "react";

export default function PostPage() {
  return (
    <>
      <Header />
      <PostList hasNavigation={false} />
    </>
  );
}
