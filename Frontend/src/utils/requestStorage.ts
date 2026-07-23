export interface RequestData {
  id: string;
  office: string;
  requestType: string;
  description: string;
  date: string;
  status: string;
}


// Get saved requests
export const getRequests = (): RequestData[] => {

  const savedRequests = localStorage.getItem("requests");


  if (!savedRequests) {
    return [];
  }


  try {

    return JSON.parse(savedRequests) as RequestData[];

  } catch (error) {

    console.error(
      "Failed to read requests:",
      error
    );

    return [];

  }

};



// Save a new request
export const saveRequest = (
  request: RequestData
): void => {


  const requests = getRequests();


  const updatedRequests = [
    ...requests,
    request
  ];


  localStorage.setItem(
    "requests",
    JSON.stringify(updatedRequests)
  );


};



// Delete all requests
export const clearRequests = (): void => {

  localStorage.removeItem("requests");

};



// Delete single request
export const deleteRequest = (id: string): void => {

  const requests = getRequests();

  const updatedRequests = requests.filter(
    (request) => request.id !== id
  );

  localStorage.setItem(
    "requests",
    JSON.stringify(updatedRequests)
  );

};