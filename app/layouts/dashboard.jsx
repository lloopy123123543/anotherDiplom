
import {Avatar, Card, CardBody, Spinner, Tab, Tabs, TabsHeader, Typography} from "@material-tailwind/react";
import {ChatBubbleLeftEllipsisIcon, Cog6ToothIcon, HomeIcon} from "@heroicons/react/24/solid";
import {Profile} from "@/app/dashboard/profile";
import {useEffect, useState} from "react";
import {account, databases} from "@/app/appwrite";
import {useRouter} from "next/navigation";
import {Query} from "appwrite";
import Home from "@/app/dashboard/home";
import {GigaChat} from "@/app/components/GigaChat/GigaChat";

export function Dashboard() {
  const [dashPage, setDashPage] = useState("home");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  async function exit() {
    await account.deleteSession('current');
    router.push("/sign-in");
  }

  useEffect(() => {
    async function getUser() {
      try {
        const userData = await account.get();
        setUser(userData);
        setIsLoading(false)
      } catch (error) {
        console.error('Error retrieving user data:', error);
        setIsLoading(false)
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    async function getDatabase() {
      if (user) {
        try {
          const res = await databases.listDocuments(
            '664dccf6002506fb7cb7',
            '664dccfc0017dce8b2a6',
            [
              Query.equal('userId', user["$id"])
            ]
          );
          setProfileInfo(res.documents[0])
        } catch (error) {
          console.error('Error fetching database:', error);
        }
      }
    }
      getDatabase();

  }, [ user]);


  return (
    <div className="min-h-screen">
      <div onClick={() => exit()} className="w-screen flex justify-end pr-10 cursor-pointer hover:text-blue-800">Выйти</div>
      <Card
        className="mx-3  mb-6 lg:mx-4 border border-blue-gray-100 backdrop-blur-sm bg-white/40">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            {isLoading ? (
              <Spinner/>
            ) : (
              <div className="flex items-center gap-6">
                <Avatar
                  src={profileInfo && profileInfo.avatar ? profileInfo.avatar : ""}
                  alt={profileInfo && profileInfo.name ? profileInfo.name : ""}
                  size="xl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                />
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-1">
                    {profileInfo && profileInfo.Name ? profileInfo.Name : "Имя"}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-600"
                  >
                    Пользователь
                  </Typography>
                </div>
              </div>
            )}
            <div className="w-96">
              <Tabs value={dashPage}>
                <TabsHeader>
                  <Tab onClick={() => setDashPage("home")} value="home">
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5"/>
                    Главная
                  </Tab>
                  <Tab onClick={() => setDashPage("profile")} value="profile">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5"/>
                    Профиль
                  </Tab>
                  <Tab onClick={() => setDashPage("settings")} value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5"/>
                    Настройки
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>

          {dashPage === "home" && (
            <Home user={profileInfo}/>
          )}

          {dashPage === "profile" && (
            <Profile profileInfo = {profileInfo} setProfileInfo={setProfileInfo} user={user} setUser={setUser}/>
          )}

          {/*<GigaChat/>*/}
        </CardBody>
      </Card>
    </div>
  );
}
