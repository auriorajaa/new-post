import React, { PropsWithChildren } from 'react'

type Props = PropsWithChildren;

const PostLayout = ({children}: Props) => {
  return (
    <div>{children}</div>
  )
}

export default PostLayout