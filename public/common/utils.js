import got from "got";

export const getGeneratedId = async (origin) => {
  try {
    const res = await got.get(`${origin}/api/url`, {});
    if (res.statusCode === 200) {
      return res.body;
    }
    return false;
  } catch {
    return false;
  }
};

// export const hostFile = (password, id) => {
//   instance.put(`/api/url/new/${id}`, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     json: {
//       password,
//     },
//   });
// };

// export const validatePassword = async (id, password) => {
//   const req = await got.post(`/api/url/${id}/authorize`, {
//     json: { password },
//   });
// };

// export const getHostedData = (id, password) => {
//   got.get(`/api/url/${id}`, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     json: { password },
//   });
// };
export const test  = async () => {
  console.log("Hello World");
}