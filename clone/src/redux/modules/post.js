import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import axios from "axios";
import instance from "../../axios";
import moment from "moment";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const GET_DETAIL = "GET_DETAIL";
const IS_LIKE = "IS_LIKE";
const NEW_COMMENT = "NEW_COMMENT";
// 액션 생성 함수
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));

const addPost = createAction(ADD_POST, (post_list) => ({
  post_list,
}));

// [공성훈] editPost 작업 중
const editPost = createAction(EDIT_POST, (image, content, postId) => ({
  image,
  content,
  postId,
}));
const deletePost = createAction(DELETE_POST, (post) => ({ post }));
const getDetail = createAction(GET_DETAIL, (post) => ({ post }));
const like = createAction(IS_LIKE, (postId, userId) => ({ postId, userId }));
const newComment = createAction(NEW_COMMENT, (postId) => ({ postId }));
// 기본값 지정
const initialState = {
  list: [],
  detail: false,
};

const initalPost = {
  content: "",
  img_url:
    "https://newsimg.hankookilbo.com/cms/articlerelease/2021/06/05/ef519975-80c8-40b6-b25a-47ab6270dc60.png",
  post_date: moment().format("YYYY-MM-DD"),
  title: "",
  // uid: "키값",
  // userId:"값",
  area: "",
};

const addPostDB = (image, content) => {
  //formData에 이미지 담기
  const formData = new FormData();
  formData.append("image", image);
  formData.append("content", content);
  const TOKEN = sessionStorage.getItem("token");
  //   const options = {
  //     headers: {
  //       "content-type": "multipart/form-data",
  //       authorization: `${TOKEN}`,
  //     },
  //     data: formData,
  //   };

  return function (dispatch, getState, { history }) {
    // console.log(options.data);
    // for (let value of options.data.values()) {
    //   // formdata 확인, 콘솔로그로 확인 불가
    //   console.log(value);
    // }
    axios
      .post("http://3.36.100.253/api/posts", formData, {
        headers: {
          authorization: `${TOKEN}`,
        },
      })
      .then((res) => {
        let post_list = res.data;

        history.replace("/");
        dispatch(addPost(post_list));
      })
      .catch((error) => {
        alert("이미지를 추가해 주세요");
        console.log(error.response);
      });
  };
};

const getMainAPI = () => {
  return function (dispatch, getState, { history }) {

    const TOKEN = sessionStorage.getItem("token")
    instance.get("/",  {
      headers: {
        authorization: `${TOKEN}`,
      }}    ).then((response) => {
    

      let post_list = [];
      response.data.forEach((post) => {
        // console.log({...post});
        post_list.push({ ...post });
      });

      dispatch(setPost(post_list));
    });

    // console.log(initialState.list)
    // const post = [...initialState.list,{id: "yougnble@aa.com",
    // nickname: "youngble",
    // content:"test 내용",
    // image: 'https://newsimg.hankookilbo.com/cms/articlerelease/2021/06/05/ef519975-80c8-40b6-b25a-47ab6270dc60.png'}]
    // console.log(post);

    // // post_list.push(post)
    // console.log(post)
    // dispatch(setPost(post)) //나중에 필요
  };
};

// withdraw
// [공성훈] editDB 작업 중
const editPostDB = (image, content, postId) => {
  return function (dispatch, getState, { history }) {
    //formData에 이미지 담기
    const formData = new FormData();
    formData.append("image", image);
    formData.append("content", content);
    const TOKEN = sessionStorage.getItem("token");

    // const a = `Bearer ${TOKEN}`;
    // console.log(a.split(" "));
    axios
      .put(`http://3.36.100.253/api/posts/${postId}`, formData, {
        headers: {
          authorization: `${TOKEN}`,
        },
      })
      .then((res) => {
        // let users = res.data
        history.replace("/");
        dispatch(editPost(image, content, postId));
      })
      .catch((error) => {
        alert("이미지를 추가해 주세요");
        console.log(error);
      });
  };
};

const deletePostDB = (postId) => {
  return function (dispatch, getState, { history }) {
    const TOKEN = sessionStorage.getItem("token");

    // const a = `Bearer ${TOKEN}`;
    // console.log(a.split(" "));
    instance
      .delete(`/api/posts/${postId}`, {
        headers: {
          authorization: `${TOKEN}`,
        },
      })
      .then((res) => {
        // let users = res.data
        history.replace("/");
        dispatch(deletePost(postId));
      })
      .catch((err) => {
        console.log("withdraw : 에.러", err);
      });
  };
};

const getDetailPost = () => {
  return function (dispatch, getState, { history }) {
    dispatch(getDetail());
  };
};

const likePost = (postId, userId) => {
  return function (dispatch, getState, { history }) {
    const TOKEN = sessionStorage.getItem("token");

    axios
      .post(
        `http://3.36.100.253/api/likes/${postId}`,
        {},
        {
          headers: {
            authorization: `${TOKEN}`,
          },
        }
      )
      .then((response) => {
        dispatch(like(postId, userId));
      });
  };
};

// 리듀서
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list;
      }), // 리스트를 초기값에서 갈아끼우기
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post_list);

        // draft.list = action.payload.post;
      }),
    // [공성훈] 작업 중
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let index = draft.list.findIndex(
          (l) => l.postId === action.payload.postId
        );

        draft.list[index] = {
          ...draft.list[index],
          ...action.payload.new_post,
        };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        let new_post_list = draft.list.filter((v) => {
          if (v.postId !== action.payload.post) {
            return v;
          }
        });
        draft.list = new_post_list;
      }),

    [GET_DETAIL]: (state, action) =>
      produce(state, (draft) => {
        draft.detail = true;
      }),
    [IS_LIKE]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex(
          (p) => p.postId === action.payload.postId
        );
        let likeIdex = draft.list[idx].likeList.findIndex(
          (p) => p.userId === action.payload.userId
        );

        const is_like = { userId: action.payload.userId };
        likeIdex === -1
          ? draft.list[idx].likeList.push(is_like)
          : draft.list[idx].likeList.splice(likeIdex);
      }),
    [NEW_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex(
          (p) => p.postId === action.payload.postId
        );
        // 게시물 수정과 같은 방법으로 해당 게시물의 index를 찾아내 comments에 아무 정보(add)를 추가해준다. 어차피 comments 숫자 세는 용도로 사용
        draft.list[idx].commentList.push("count를위해추가");
        // console.log(draft.list[idx]) // draft는 콘솔로 찍어봐도 proxy 로만뜨고 null 값만 나와서 확인못한다
        // console.log(state.list[idx]); // 위치 체크할땐 state로 해볼것
      }),
  },
  initialState
);

// 액션생성자 내보냄
const actionCreators = {
  setPost,
  getMainAPI,
  addPostDB,
  addPost,
  editPost, // [공성훈] 작업 중
  editPostDB, // [공성훈] 작업 중
  deletePost,
  deletePostDB,
  getDetailPost,
  likePost,
  like,
  newComment,
};

export { actionCreators };
