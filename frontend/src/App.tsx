import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "@pages/MainPage";
import SelectPage from "@pages/SelectPage";
import ProjectPage from "@pages/ProjectPage";
import JobPage from "@pages/JobPage";
import ResultPage from "@pages/ResultPage";
import ErrorPage from "@pages/ErrorPage";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage />}></Route>
					<Route path="/select" element={<SelectPage />}></Route>
					<Route path="/project" element={<ProjectPage />}></Route>
					<Route path="/job" element={<JobPage />}></Route>
					<Route path="/result" element={<ResultPage />}></Route>
					<Route path="/*" element={<ErrorPage />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
