import {useRef, useEffect} from "react"
import api from "../../api/api"
import { Permission, Role } from "appwrite"

const ImageUpload = ({user}) => {

  const cloudinaryRef = useRef();
  const widgetRef = useRef();

 useEffect(()=>{

  async function handleEmployeeInfo(image, fileName){
    try{
      const data = {
        image,
        fileName,
        userID: user.$id,
        email: user.email
      }

      const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

      const findEmployee = employeeList.documents.filter((employee)=>employee.email === localStorage.getItem("email"))

      if(findEmployee.length){
        await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, findEmployee[0].$id, data)
      }else{
        await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, data, [Permission.read(Role.any())])
      }

    }catch(err){
      console.error(err)
    }
  }

    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget({
      cloudName: "melt",
      uploadPreset: "wpwjg7hr"
    }, (error, result)=>{
      if(result.event === "success"){
        const image = result.info.secure_url
        const fileName = result.info.original_filename
        handleEmployeeInfo(image, fileName)
      }else if(result.event === "abort"){
        window.location.reload();
      }
    })
  },[user.$id, user.email]);

  return (
    <button className="button widget" onClick={()=>widgetRef.current.open()}>
      Upload Image
    </button>
  );
};

export default ImageUpload;