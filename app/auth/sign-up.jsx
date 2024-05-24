"use client"
import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {account, ID} from "@/app/appwrite";
import {useRouter} from "next/navigation";


export function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const router = useRouter()

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



  async function handleRegister() {
    try {
      await account.create(ID.unique(), email, password)

    } catch (e){
      console.error(e)
    }
  }

  return (
    <section className="m-8 flex">
            <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Регистрация</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Введите почту и пароль для регистрации.</Typography>
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
                  Политикой конфеденциальности
                </a>
              </Typography>
            }
            containerProps={{className: "-ml-2.5"}}
          />
          <Button onClick={() => handleRegister()} className="mt-6" fullWidth>
            Зарегестрироваться
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Уже есть аккаунт?
            <Link href="/sign-in" className="text-gray-900 ml-1">Войти</Link>
          </Typography>
        </form>

      </div>
    </section>
  );
}

export default SignUp;
