import axios from'axios'

const api=import.meta.env.VITE_BACKEND_API;


const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const loginapi=async({email,password})=>{
    try {
    const res = await axios.post(`${api}/login`, { 
      email, 
      password 
    });
    
    return res.data;

  } catch (e) {
    console.error("Login Error:", e.response?.data || e.message);
    throw e; 
  }
}


export const getUserApi=async()=>{
    try{
    const res=await axios.get(`${api}/user`,getAuthHeader());
    
    return res.data;
    }catch(e){
        console.error("USER data fetch Error:", e.response?.data || e.message);
    throw e; 
    }
}
export const signupapi=async({username,email,password,role})=>{
    try{
    const res=await axios.post(`${api}/signup`,{
        username,
        email,
        password,
        role
    });
    console.log("Signup Success:", res.data);
    
    return res.data;
    }catch(e){
        console.error("Signup Error:", e.response?.data || e.message);
    throw e; 
    }
}
export const createRoomApi = async (roomData) => {
  
  const res = await axios.post(`${api}/room/create`, roomData, getAuthHeader());
  return res.data;
};


export const updateRoomApi = async (id, updateData) => {
  const res = await axios.put(`${api}/room/update/${id}`, updateData, getAuthHeader());
  return res.data;
};


export const getAllRoomsApi = async () => {
  const res = await axios.get(`${api}/room/getall`, getAuthHeader());
  return res.data;
};


export const getRoomByIdApi = async (id) => {
  const res = await axios.get(`${api}/room/get/${id}`, getAuthHeader());
  return res.data;
};


export const deleteRoomApi = async (id) => {
  const res = await axios.delete(`${api}/room/delete/${id}`, getAuthHeader());
  return res.data;
};


export const changePrivacyApi = async (id, privacyData) => {
  
  const res = await axios.patch(`${api}/room/status/${id}`, privacyData, getAuthHeader());
  
  return res.data;
};


export const joinRoomApi = async (id, password) => {
  const res = await axios.patch(`${api}/room/join/${id}`, { password }, getAuthHeader());
  
  return res.data;
};


export const leaveRoomApi = async (roomid) => {
  const res = await axios.patch(`${api}/room/leave/${roomid}`, {}, getAuthHeader());
  return res.data;
};

export const addMessageApi = async (roomId, content) => {
  const res = await axios.post(
    `${api}/msg/add/${roomId}`, 
    { content }, 
    getAuthHeader()
  );
  return res.data;
};


export const getMessagesApi = async (roomId) => {
  const res = await axios.get(
    `${api}/msg/chat/${roomId}`, 
    getAuthHeader()
  );
  return res.data;
};


export const removeMessageApi = async (msgId) => {
  const res = await axios.delete(
    `${api}/msg/remove/${msgId}`, 
    getAuthHeader()
  );
  return res.data;
};


export const modifyMessageApi = async (msgId, content) => {
  const res = await axios.patch(
    `${api}/msg/edit/${msgId}`, 
    { content }, 
    getAuthHeader()
  );
  return res.data;
};

export const  getRoomsInRange=async({lng,lat})=>{
  const res=await axios.get(
    `${api}/user/nearby?lng=${lng}&${lat}`,getAuthHeader()
  );
}

export const  setRange=async({lng,lat})=>{
  const res=await axios.patch(
    `${api}/user/location?lng=${lng}&${lat}`,getAuthHeader()
  );
}
export const getLocalRooms=async({lng,lat,distance})=>{
  const res=await axios.get(`${api}/room/nearby?lng=${lng}&lat=${lat}&distance=${distance}`,getAuthHeader()) ;
  
  return res.data;
}
export const verifyGoogleCode = async (code) => {
    const response = await axios.post(`${api}/auth/google`, { code });

    return response.data;
};

