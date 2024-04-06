/**
 * When responses from API are successful, response data comes in this form.
 * Errors are handled through catch block
 * ts
 * try {
 *   const response = await axiosPrivate.get<ResponseData<Entity>>("/someEndpoint");
 *   const data = response.data.data;
 *   ...
 * } catch (error) {
 *   // handle errors
 * }
 *
 */
export interface ResponseData<T> {
  data: T;
}
