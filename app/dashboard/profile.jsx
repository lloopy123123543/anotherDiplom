import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import {

  PencilIcon,
} from "@heroicons/react/24/solid";
import ProfileInfoCard from "@/app/widgets/cards/profile-info-card";

import authorsTableData from "@/app/data/authors-table-data";

export function Profile({user}) {
  return (
    <>
          <div className="flex justify-between">
            <div className="gird-cols-1 mb-12 grid gap-12 px-4 ">
              <ProfileInfoCard
                title="Информация о пользователе"
                description= {(user && user.about) ? user.about : "-"}
                details={{
                  "Имя": (user && user.fullName) ? user.fullName : "-",
                  "Телефон": (user && user.phone) ? user.phone : "-",
                  email: (user && user.email) ? user.email : "-",
                  "Локация": (user && user.location) ? user.location : "-",
                }}
                action={
                  <Tooltip content="Edit Profile">
                    <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500"/>
                  </Tooltip>
                }
              />
            </div>

            <Card className="w-screen">
              <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                  <tr>
                    {["author", "function", "status", "employed", ""].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                  </thead>
                  <tbody>
                  {authorsTableData.map(
                    ({img, name, email, job, online, date}, key) => {
                      const className = `py-3 px-5 ${
                        key === authorsTableData.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={name}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Avatar src={img} alt={name} size="sm" variant="rounded"/>
                              <div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-semibold"
                                >
                                  {name}
                                </Typography>
                                <Typography className="text-xs font-normal text-blue-gray-500">
                                  {email}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {job[0]}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {job[1]}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={online ? "green" : "blue-gray"}
                              value={online ? "online" : "offline"}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {date}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              as="a"
                              href="#"
                              className="text-xs font-semibold text-blue-gray-600"
                            >
                              Edit
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>


    </>
  );
}

export default Profile;
