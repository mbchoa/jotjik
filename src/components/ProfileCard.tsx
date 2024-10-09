import { UserCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import NextImage from 'next/image';

const user = {
  name: 'Michael',
  imageUrl:
    'https://lh3.googleusercontent.com/a-/AOh14GjL1K4CDur2OP98Sp6jaD0AfVIOs8O13FWvDMTB7A=s96-c',
};

export const ProfileCard = () => {
  const { data: session } = useSession();
  const formattedDate = format(Date.now(), 'MMMM d, yyyy');

  return (
    <div className="bg-white p-6 overflow-hidden rounded-lg shadow">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex sm:space-x-5">
          <div className="flex-shrink-0">
            {session?.user.image ? (
              <NextImage
                alt="profile picture"
                src={session?.user.image}
                className="mx-auto h-20 w-20 rounded-full"
                width={80}
                height={80}
              />
            ) : (
              <UserCircleIcon className="h-20 w-20 text-gray-300 stroke-1 mx-auto" />
            )}
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
            <p className="text-sm font-medium text-gray-600">Welcome back</p>
            <p className="text-xl font-bold text-gray-900 sm:text-2xl">{user.name}</p>
          </div>
        </div>
        <div className="ml-auto self-start">
          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
            <p className="font-medium text-gray-600">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
