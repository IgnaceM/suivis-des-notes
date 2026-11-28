import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CourseDetailPage from "./pages/CourseDetailPage";
import CoursesPage from "./pages/CoursesPage";
import HomePage from "./pages/HomePage";

import { useEffect } from "react";
import Loading from "./composants/Loading";
import About from "./pages/About";
import AnalysePage from "./pages/AnalysePage";
import { Faq } from "./pages/Faq";
import { Mentions } from "./pages/Mentions";
import PeriodeManager from "./pages/PeriodeManager";
import PrivacyPolicy from "./pages/PrivacyPolicy ";
import SettingsPage from "./pages/SettingsPage";
import SharePage from "./pages/SharePage";

const App = () => {
	useEffect(() => {
		document.title = "Suivis des notes";
	});
	return (
		<Router>
			<div className="flex w-full font-medium mt-0 flex-col h-full dark:bg-zinc-800 ">
				<div className="">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/courses" element={<CoursesPage />} />
						<Route path="/courses/:id" element={<CourseDetailPage />} />
						<Route path="/analysePage" element={<AnalysePage />} />
						<Route path="/sharePage" element={<SharePage />} />
						<Route path="/settingsPage" element={<SettingsPage />} />

						<Route path="/periodeManager" element={<PeriodeManager />} />

						<Route path="/faq" element={<Faq />} />
						<Route path="/about" element={<About />} />
						<Route path="/privacyPolicy" element={<PrivacyPolicy />} />

						<Route path="/mentions" element={<Mentions />} />

						<Route path="/loading" element={<Loading />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
};

export default App;
