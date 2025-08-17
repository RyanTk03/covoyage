"use client";
import { useUser } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Typography, Radio, Textarea } from '@/components/MaterialTailwind';
import { UserGenderCodeEnum } from "@/lib/constants";

export default function HomePage() {
	const { user } = useUser();
	const [error, setError] = useState<string | null>(null);
	const [registered, setRegistered] = useState(false);
	const navigate = useRouter();
	const [data, setData] = useState<{
		gender?: string,
		birthday?: string,
		description?: string,
	}>({
		gender: undefined,
		birthday: undefined,
		description: undefined,
	});

	const registerUser = useCallback(() => {
		let tm;
		if (user !== null) {
			fetch("/api/v0/users", {
				method: "POST",
				body: JSON.stringify({
					clerkId: user?.id,
					...data,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then(() => {
				setError(null);
				setRegistered(true);
				user?.reload();
				tm = setTimeout(() => {
					navigate.replace('/dashboard/my-account');
				}, 3000);
			})
			.catch((error) => setError(error.message));
		}
		
		return () => {
			if (tm) {
				clearTimeout(tm);
			}
		}
	}, [user, navigate, data]);

  	return (
    <main className="min-h-[90vh] bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
		{registered && (
			<>
				<h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to <span className="text-secondary-color">Co Voyage</span></h1>
				<p className="text-gray-600 mb-2">
					Hello <span className="font-semibold">{user!.firstName} {user!.lastName}</span> 👋
				</p>
			</>
		)}
        {!registered && error && (
          <div className="mt-4 text-red-600 text-sm bg-red-100 p-2 rounded-md">
            ⚠️ Error: {error}
          </div>
        )}
		{!registered && (
			<Card color="transparent" shadow={false}>
				<Typography color="gray" className="mt-1 font-normal">
					Additionnal informations
				</Typography>
				<form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
					<div className="mb-1 flex flex-col items-start gap-6">
						<Typography variant="h6" color="blue-gray" className="-mb-3">
							Birthday
						</Typography>
						<Input
							type="date"
							size="lg"
							placeholder="name@mail.com"
							className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
							labelProps={{
								className: "before:content-none after:content-none",
							}}
							onChange={(e) => setData({...data, birthday: e.target.value})}
						/>
						<Typography variant="h6" color="blue-gray" className="-mb-3">
							Bio
						</Typography>
						<Textarea
							size="lg"
							placeholder="describe yourself"
							className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
							labelProps={{
								className: "before:content-none after:content-none",
							}}
							onChange={(e) => setData({...data, description: e.target.value})}
						/>
						<Typography variant="h6" color="blue-gray" className="-mb-3">
							Gender
						</Typography>
						<div className="flex flex-col">
							<Radio
								name="gender"
								label="Don't specify"
								ripple={true}
								defaultChecked
								value={undefined}
								onSelect={() => setData({...data, gender: undefined})}
							/>
							<Radio
								name="gender"
								label="Man"
								ripple={false}
								onSelect={() => setData({...data, gender: UserGenderCodeEnum.MAN})}
							/>
							<Radio
								name="gender"
								label="Woman"
								ripple={false}
								onSelect={() => setData({...data, gender: UserGenderCodeEnum.WOMAN})}
							/>
						</div>
					</div>
					<div className="flex justify-between">
						<Button className="mt-6" variant="text" onClick={registerUser}>
							skip
						</Button>
						<Button className="mt-6" disabled={Object.keys(data).every(key => !data[key])} onClick={registerUser} color="green">
							save
						</Button>
					</div>
				</form>
			</Card>
		)}
      </div>
    </main>
  );
}
