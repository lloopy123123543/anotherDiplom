"use client"
import Link from "next/link";
import {Button, Checkbox, Input, Typography} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {account, ID} from "@/app/appwrite";
import {useRouter} from "next/navigation";


export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        setUser(await account.get());
        if(user){
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    }
    getUser();
  }, [user]);

  async function handleLogin() {
    try {
      await account.createEmailPasswordSession(email, password);
      setUser(await account.get());
      setEmail("");
      setPassword("");
      if (user) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Вход</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Введите почту и пароль для входа.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Ваш email
            </Typography>
            <Input
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Пароль
            </Typography>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                Я согласен с&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Обработка персональных данных
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button onClick={() => handleLogin()} className="mt-6" fullWidth>
            Войти
          </Button>

          <div className="flex items-center justify-end gap-2 mt-6">
            {/*<Checkbox*/}
            {/*  label={*/}
            {/*    <Typography*/}
            {/*      variant="small"*/}
            {/*      color="gray"*/}
            {/*      className="flex items-center justify-start font-medium"*/}
            {/*    >*/}
            {/*      Subscribe me to newsletter*/}
            {/*    </Typography>*/}
            {/*  }*/}
            {/*  containerProps={{ className: "-ml-2.5" }}*/}
            {/*/>*/}
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Забыл пароль
              </a>
            </Typography>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Нету профиля?
            <Link href="/sign-up" className="text-gray-900 ml-1">Создать аккаунт</Link>
          </Typography>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
