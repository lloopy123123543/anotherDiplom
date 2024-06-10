import {
  Card,
  Typography,
  Tooltip, Input, Button, Textarea,
} from "@material-tailwind/react";
import {

  PencilIcon,
} from "@heroicons/react/24/solid";
import ProfileInfoCard from "@/app/widgets/cards/profile-info-card";
import React, {useEffect, useState} from "react";
import {databases} from "@/app/appwrite";
import {ID, Query} from "appwrite";
import {toast} from "react-toastify";

export function Profile({user, setUser, profileInfo, setProfileInfo}) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [fullName, setFullName] = useState("")
  const [about, setAbout] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    setEmail((profileInfo && profileInfo.email && profileInfo.email) || "")
    setName((profileInfo && profileInfo.Name && profileInfo.Name) || "")
    setPhone((profileInfo && profileInfo.phone && profileInfo.phone) || "")
    setLocation((profileInfo && profileInfo.location && profileInfo.location) || "")
    setFullName((profileInfo && profileInfo.fullName && profileInfo.fullName) || "")
    setAbout((profileInfo && profileInfo.about && profileInfo.about) || "")
    setAvatarUrl((profileInfo && profileInfo.avatar && profileInfo.avatar) || "")
  }, [profileInfo]);

  const createUser = async () => {
      const res = await databases.listDocuments(
        '664dccf6002506fb7cb7',
        '664dccfc0017dce8b2a6',
        [
          Query.equal('userId', user["$id"])
        ]
      );


      if(res.documents.length > 0){
        await databases.updateDocument(
          '664dccf6002506fb7cb7',
          '664dccfc0017dce8b2a6',
          `${res.documents[0]["$id"]}`,
          {
            "email": `${email}`,
            "Name": `${name}`,
            "phone": `${phone}`,
            "location": `${location}`,
            "fullName": `${fullName}`,
            "about": `${about}`,
            "avatar": `${avatarUrl}`,
          }
        );
      }
      else{
        await databases.createDocument(
          '664dccf6002506fb7cb7',
          '664dccfc0017dce8b2a6',
          ID.unique(),
          {
            "email": `${email}`,
            "userId": `${user && user["$id"]}`,
            "Name": `${name}`,
            "phone": `${phone}`,
            "location": `${location}`,
            "fullName": `${fullName}`,
            "about": `${about}`,
            "avatar": `${avatarUrl}`,
          }
        );

        toast.success("Добавлено")
      }

    setProfileInfo({
      Name: name,
      fullName: fullName,
      email: email,
      userId: user["$id"],
      phone: phone,
      location: location,
      about: about,
      avatar: avatarUrl,
    })
  }

  return (
    <>
      <div className="flex justify-between flex-col">
        <div className="gird-cols-1 mb-12 grid gap-12 px-4 ">
          <ProfileInfoCard
            title="Информация о пользователе"
            description={(profileInfo && profileInfo.about) ? profileInfo.about : "-"}
            details={{
              "ФИО": (profileInfo && profileInfo.fullName) ? profileInfo.fullName : "-",
              "Телефон": (profileInfo && profileInfo.phone) ? profileInfo.phone : "-",
              email: (profileInfo && profileInfo.email) ? profileInfo.email : "-",
              "Локация": (profileInfo && profileInfo.location) ? profileInfo.location : "-",
            }}
            action={
              <Tooltip content="Edit Profile">
                <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500"/>
              </Tooltip>
            }
          />
        </div>

        <Card className="p-10 ">
          <form className="flex flex-col gap-4">
            <div>
              <Typography>
                Сокращенное имя
              </Typography>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full"
                variant="outlined"
                color="blue-gray"
                placeholder={"Пояснение"}
                size="sm"
              />
            </div>
            <div>
              <Typography>
                Полное имя
              </Typography>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                className="w-full"
                variant="outlined"
                color="blue-gray"
                placeholder={"Пояснение"}
                size="sm"
              />
            </div>

            <div>
              <Typography>
                О тебе
              </Typography>
              <Textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                type="text"
                className="w-full"
                variant="outlined"
                color="blue-gray"
                placeholder={"Пояснение"}
                size="sm"
              />
            </div>

            <div>
              <Typography>
                Телефон
              </Typography>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                className="w-full"
                variant="outlined"
                color="blue-gray"
                placeholder={"Пояснение"}
                size="sm"
              />
            </div>

            <div>
              <Typography>
                Email
              </Typography>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="w-full"
                variant="outlined"
                color="blue-gray"
                placeholder={"Пояснение"}
                size="sm"
              />
            </div>

            <div>
              <Typography>
                Локация
              </Typography>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text"
                className="w-full"
                variant="outlined"
                color="blue-gray"
                placeholder={"Пояснение"}
                size="sm"
              />
            </div>

            <div>
              <Typography>
                Url avatar
              </Typography>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                type="text"
                className="w-full"
                variant="outlined"
                color="blue-gray"
                placeholder={"Пояснение"}
                size="sm"
              />
            </div>

            <Button onClick={() => createUser()}>Изменить данные</Button>

          </form>
        </Card>



      </div>


    </>
  );
}

export default Profile;
