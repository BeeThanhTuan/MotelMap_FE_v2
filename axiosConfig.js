import axios from 'axios';

axios.defaults.withCredentials = false;
// Tạo một instance Axios mới
const instance = axios.create();

// Xóa các interceptor mặc định của Axios
instance.interceptors.response.use(
  (response) => {
    // Tắt toast ở đây
    return response;
  },
  (error) => {
    // Xử lý lỗi ở đây
    return Promise.reject(error);
  }
);
export default axios;