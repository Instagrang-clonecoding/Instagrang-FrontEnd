import React from "react";
import Grid from "../elements/Grid";
import Text from "../elements/Text";
import Image from "../elements/Image";
import IconButton from "../elements/IconButton";
import styled from "styled-components";
import Input from "../elements/Input";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postAction } from "../redux/modules/post";
import { actionCreators as userAction } from "../redux/modules/user";

import { actionCreators as commentActions } from "../redux/modules/comment";
import { actionCreators as postActions } from "../redux/modules/post";
import { history } from "../redux/configureStore";

import CommentWrite from "./CommentWrite";

const Post = (props) => {
  // console.log(props)
  const dispatch = useDispatch();
  const user_list = useSelector((state) => state.user.user);
  // console.log(user_list)
  // const is_like = useSelector((state)=>state.post.is_like);
  const _post = useSelector((state) => state.post);
  const login_userId = user_list.userId;

  const [detail, setDetail] = React.useState(false);

  const result = props.likeList.filter(
    (userId) => userId.userId === login_userId
  );
 
  const [is_like, setLike] = React.useState(result.length === 1 ? true : false);
  
  React.useEffect(() => {
    dispatch(postAction.getMainAPI());

    // dispatch(post)
  }, []); //좋아요를 누를때마다 update 되게 해줌

  const editPost = () => {
    console.log("editPost 클릭확인");
    dispatch(postAction.editPostDB(props.postId));
  };
  const deletePost = () => {
    console.log("deletePost 클릭확인");
    dispatch(postAction.deletePostDB(props.postId));
  };

  return (
    <React.Fragment>
      <Grid border="1px solid #DBDBDB" position margin="auto" width="50%" minWidth= "456px">
        <Grid is_flex border="1px solid #DBDBDB">
          <Image imageType="circle" src={props.user_profile} />
          <Text padding="0px 0px" bold textalign>
            {props.nickname}
          </Text>
          {props.is_me ? (
            <Grid is_flex>
              <Text
                margin="0 0 0 auto"
                padding="0px 0px 6px 0px"
                textalign
                bold
                size="15px"
                left="60%"
                color="#0095F6"
                cursor="pointer"
                _onClick={() => {
                  editPost();
                  // dispatch(postActions.setPost(props.postId));
                  history.push(`/addpost/${props.postId}`);
                }}
              >
                수정
              </Text>
              <Text
                margin="0 16px 0 10px"
                padding="0px 0px 6px 0px"
                textalign
                bold
                size="15px"
                left="70%"
                color="#0095F6"
                cursor="pointer"
                _onClick={deletePost}
              >
                삭제
              </Text>
            </Grid>
          ) : (
            <IconButton
              moreView
              width="20px"
              margin="0 16px 0 auto"
              cursor="default"
            ></IconButton>
          )}
        </Grid>
        <Grid>
          <Image
            imageType="rectangle"
            src={"http://3.36.100.253" + props.image}
          />
        </Grid>
        <Grid is_flex padding="6px 0px 8px 10px">
          { is_like ? (
            <IconButton
              likeIcon
              padding="8px"
              _onClick={() => {
                setLike(!is_like);
                dispatch(postAction.likePost(props.postId, login_userId));
                
              }}
            />
          ) : (
            <IconButton
              unLikeIcon
              padding="8px"
              _onClick={() => {
                setLike(!is_like);
                dispatch(postAction.likePost(props.postId, login_userId));
                
              }}
            />
          )}
          <IconButton
            commentIcon
            padding="8px"
            _onClick={() => {
              dispatch(commentActions.getComment(props.postId));
              history.push(`/posts/${props.postId}`);
            }}
          />

          {/*좋아요하트 아이콘, 댓글말풍선 아이콘*/}
        </Grid>
        <Grid>
          <Text bold margin="0px 10px">
            좋아요 {props.likeList.length} 개
          </Text>
        </Grid>
        <Grid is_flex>
          <Text margin="0px 10px" bold>
            {props.nickname}
          </Text>
          {detail ? (
            <Text wordbreak padding="5px">
              {props.content}
            </Text>
          ) : (
            <Grid is_flex>
              <SkipContent>{props.content}</SkipContent>
              <Grid _onClick={() => setDetail(true)}>
                <Text color="#8E8E8E">더보기</Text>
              </Grid>
            </Grid>
          )}{" "}
          {/* 생략부분*/}
        </Grid>
        <Grid>
          {props.commentList.length > 0 ? (
            <Text
              bold
              margin="0px 10px"
              _onClick={() => {
                dispatch(commentActions.getComment(props.postId));
                history.push(`/posts/${props.postId}`);
              }}
            >
              댓글 {props.commentList.length}개 모두 보기
            </Text>
          ) : null}
        </Grid>
        <Grid>
          <Text size="10px" margin="0px 10px" bold>
            {props.createdAt}
          </Text>
        </Grid>

        <CommentWrite postId={props.postId} />
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_profile:
    "https://youngble.s3.ap-northeast-2.amazonaws.com/KakaoTalk_Photo_2021-11-17-00-56-23.jpeg", //테스트용으로 그전 강의에서 쓰던것 가져와서 먼저 써봄
  likeList: [],
  detail: false,
  nickname: "test_nickname",
  content:
    "\n간단한 소개글입니다. 한칸을 띄지않고 계속쓴다면 이렇게 쭉쭉 나올것입니다. 포스트 맨마지막 부분까지말이죠, 하지만 한칸을 띄는순간 더보기버튼이 활성화 되게 됩니다. 이게 바로 -webkit-line-clamp",
  image:
    "https://newsimg.hankookilbo.com/cms/articlerelease/2021/06/05/ef519975-80c8-40b6-b25a-47ab6270dc60.png",
  createdAt: "2021-11-29 11:00:00",
  commentList: [],
  is_me: false,
};

const SkipContent = styled.p`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  width: 100%;
  white-space: pre-wrap;
  /* margin : 0px 20px 0px 0px; */
`;

export default Post;
