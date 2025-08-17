import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";


export default function Home() {

	return (
		<main className={styles.main}>
			<h1 className={styles.headline}>It&apos;s more than just a trip</h1>
			<div className={styles.gallery}>
				<div>
					<Image
						alt=""
						src="/images/home-4.jpg"
						fill
						objectFit="cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					<Image
						alt=""
						src="/images/home-5.jpg"
						fill
						objectFit="cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
				<div>
					<Image
						alt=""
						src="/images/home-2.jpg"
						fill
						objectFit="cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					<Image
						alt=""
						src="/images/home-3.jpg"
						fill
						objectFit="cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
				<div>
					<Image
						alt=""
						src="/images/home-3.jpg"
						fill
						objectFit="cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					<Image
						alt=""
						src="/images/home-2.jpg"
						fill
						objectFit="cover"
						sizes="(max-width: 468px) 100vw, (max-width: 768px) 50vw, 33vw"
					/>
				</div>
			</div>
			<h2 className={styles.headline}>It&apos;s a way to share memories</h2>
			<div className={styles.buttonWrapper}>
				<Link href="/signup">Get started</Link>
			</div>
		</main>
	);
}