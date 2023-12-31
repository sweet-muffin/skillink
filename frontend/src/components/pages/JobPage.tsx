import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import HeaderBlock from "@blocks/HeaderBlock";
import Spinner from "@components/blocks/Spinner";
import FooterBlock from "@blocks/FooterBlock";
import * as CT from "@assets/customTypes";
import { isMobile } from "@assets/mobile";
import JobModal from "@blocks/JobModal";
import IntroModal from "@blocks/IntroModal";
import { createBrowserHistory } from "history";

const JobPage = () => {
	const navigate = useNavigate();
	const [jobList, setJobList] = useState<CT.JobType[] | null>(null);
	const [positionList, setPositionList] = useState<CT.PositionType[]>([]);
	const [requirements, setRequirements] = useState<string | null>(null);
	const [curOffset, setCurOffset] = useState(0);
	const [curJobID, setJobID] = useState(-1);
	const [positionModalOn, setPositionModal] = useState(true);
	const [introInfo, setIntroInfo] = useState<CT.IntroType | null>(null);
	const [moreLoading, setMoreLoading] = useState(false);
	const [selectedCompany, setSelectedCompany] = useState(-1);
	const [jobTitle, setJobTitle] = useState<string | null>(null);
	const [moreButtonOn, setMoreButtonOn] = useState(true);

	const history = createBrowserHistory();

	useEffect(() => {
		const FetchData = async () => {
			await axios({
				method: "get",
				url: `/api/wanted/categories`,
				headers: {
					accept: "application/json",
					"wanted-client-id": process.env.REACT_APP_WANTED_ID,
					"wanted-client-secret": process.env.REACT_APP_WANTED_SECRET,
				},
			})
				.then((response) => {
					setJobList(response.data.data[0].sub_tags);
				})
				.catch((error) => {
					// console.log(error);
				});
		};
		FetchData();
	}, []);

	useEffect(() => {
		const unlistenHistoryEvent = history.listen(({ action }) => {
			if (action === "POP") {
				if (introInfo) {
					ModalBackHander();
				}
			}
		});
		return unlistenHistoryEvent;
	}, [history, introInfo]);

	const FetchPositionData = async () => {
		setMoreLoading(true);
		await axios({
			method: "get",
			url: `/api/wanted/positions?curJobID=${curJobID}&curOffset=${curOffset}`,
			headers: {
				accept: "application/json",
				"wanted-client-id": process.env.REACT_APP_WANTED_ID,
				"wanted-client-secret": process.env.REACT_APP_WANTED_SECRET,
			},
		})
			.then((response) => {
				setPositionList((prevList) => [
					...prevList,
					...response.data.data,
				]);
				setCurOffset(curOffset + 18);
				setMoreLoading(false);
				if (response.data.data.length < 18) {
					setMoreButtonOn(false);
				}
			})
			.catch((error) => {
				// console.log(error);
			});
	};
	const JobSelectHander = (jobID: number, jobTitle: string) => {
		setJobID(jobID);
		setJobTitle(jobTitle);
	};

	const JobNextHandler = () => {
		if (curJobID !== -1) {
			setPositionModal(false);
			FetchPositionData();
		}
	};

	const PositionSelectHandler = (
		positionID: number,
		url: string,
		positionName: string,
		companyName: string,
		location: string
	) => {
		const FetchIntroData = async () => {
			await axios({
				method: "get",
				url: `/api/wanted/job/${positionID}`,
				headers: {
					accept: "application/json",
					"wanted-client-id": process.env.REACT_APP_WANTED_ID,
					"wanted-client-secret": process.env.REACT_APP_WANTED_SECRET,
				},
			})
				.then((response) => {
					setRequirements(response.data.detail.requirements);
					setIntroInfo({
						detailURL: url,
						positionName: positionName,
						companyName: companyName,
						companyLocation: location,
						intro: response.data.detail.intro,
						companyURL: response.data.company.link,
					});
					history.push("/job");
					setSelectedCompany(-1);
				})
				.catch((error) => {
					// console.log(error);
				});
		};
		setSelectedCompany(positionID);
		!moreLoading && FetchIntroData();
	};

	if (introInfo) {
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = "unset";
	}

	const ModalOffHander = () => {
		history.go(-1);
		setIntroInfo(null);
		setRequirements(null);
	};

	const ModalBackHander = () => {
		setIntroInfo(null);
		setRequirements(null);
	};

	const NextPageHandler = async () => {
		document.body.style.overflow = "unset";
		await axios({
			method: "post",
			url: `/api/user_want`,
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
			data: {
				user_want: requirements!,
				source: "job",
			},
		}).then((response) => {
			// history.push(`/result?id=${response.data.want_id}`);
			navigate(`/result?id=${response.data.want_id}`);
		});
	};

	const JobChoiseAgainHandler = () => {
		setPositionModal(true);
		setPositionList([]);
	};

	return (
		<>
			{positionModalOn && (
				<>
					{jobList ? (
						<JobModal
							jobList={jobList}
							curJobID={curJobID}
							JobSelectHander={JobSelectHander}
							JobNextHandler={JobNextHandler}
						/>
					) : (
						<Spinner />
					)}
				</>
			)}
			{introInfo && (
				<IntroModal
					ModalOffHander={ModalOffHander}
					ModalBackHander={ModalBackHander}
					introInfo={introInfo!}
					NextPageHandler={NextPageHandler}
				/>
			)}
			<HeaderBlock />
			{positionList.length !== 0 ? (
				<Wrapper>
					<TopPositionDiv>
						<TopPositionText onClick={JobChoiseAgainHandler}>
							{jobTitle}&nbsp;&nbsp;
							<SmallText>X</SmallText>
						</TopPositionText>
					</TopPositionDiv>
					<PositionWrapper>
						{positionList.map((position) => (
							<PositionElement key={position.id}>
								<PositionIMG
									isselected={
										selectedCompany === position.id
											? "true"
											: "false"
									}
									onClick={() =>
										PositionSelectHandler(
											position.id,
											position.title_img.origin,
											position.name,
											position.company.name,
											`${position.address.location} · ${position.address.country}`
										)
									}
									src={position.title_img.origin}
									alt=""
								/>
								<PositionDescWrapper>
									<PositionName>{position.name}</PositionName>
									<CompanyName>
										{position.company.name}
									</CompanyName>
									<LocationText>
										{position.address.location} ·{" "}
										{position.address.country}
									</LocationText>
								</PositionDescWrapper>
							</PositionElement>
						))}
					</PositionWrapper>
					{moreButtonOn ? (
						<MoreButton
							onClick={() => FetchPositionData()}
							isloading={moreLoading ? "true" : "false"}
						>
							더보기
						</MoreButton>
					) : (
						<></>
					)}
					<FooterBlock />
				</Wrapper>
			) : (
				!positionModalOn && <Spinner />
			)}
		</>
	);
};

export default JobPage;

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const PositionWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	min-width: ${isMobile() ? "0rem" : "800rem"};
	max-width: 1800rem;
	width: ${isMobile() ? "100vw" : "75%"};
	justify-content: center;
`;

const PositionElement = styled.div`
	height: ${isMobile() ? "210rem" : "360rem"};
	width: ${isMobile() ? "170rem" : "300rem"};
	// border: 3rem solid #000000;
	margin: ${isMobile() ? "18rem 8rem" : "18rem 45rem"};
	display: flex;
	flex-direction: column;
	align-items: center;
`;

type IMGType = {
	isselected: string;
};

const PositionIMG = styled.img<IMGType>`
	width: ${isMobile() ? "170rem" : "300rem"};
	height: ${isMobile() ? "124rem" : "218rem"};
	object-fit: cover;
	border-radius: 20rem 20rem 20rem 0px;
	margin-bottom: 11rem;
	cursor: pointer;
	transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
	&:hover {
		transform: translate(-4%, -4%);
		transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	opacity: ${(props) => (props.isselected === "true" ? "0.3" : "1")};
`;

const PositionName = styled.span`
	color: #000;
	font-family: Pretendard;
	font-size: ${isMobile() ? "17rem" : "25rem"};
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	text-align: left;
	/* width: ${isMobile() ? "170rem" : "300rem"}; */
`;

const CompanyName = styled.span`
	color: #000;
	font-family: Pretendard;
	text-align: left;
	font-size: ${isMobile() ? "13rem" : "20rem"};
	font-style: normal;
	font-weight: 400;
	line-height: normal;
`;

const PositionDescWrapper = styled.div`
	width: ${isMobile() ? "170rem" : "300rem"};
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	text-align: left;
`;

const LocationText = styled.span`
	color: var(--text-sub, #989898);
	font-family: Pretendard;
	font-size: ${isMobile() ? "13rem" : "20rem"};
	font-style: normal;
	font-weight: 400;
	line-height: normal;
`;

const MoreButton = styled.div<{
	isloading: string;
}>`
	border-radius: 20rem;
	background: white;
	border: 2rem solid var(--udemy-sub-1, #5027c8);

	height: 41rem;
	padding: 0 38rem;
	flex-shrink: 0;
	color: var(--udemy-sub-1, #5027c8);
	text-align: center;
	font-family: Pretendard;
	font-size: 20rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	display: flex;
	text-align: center;
	align-items: center;
	justify-content: center;
	margin-top: 50rem;
	margin-right: 15rem;
	margin-bottom: 50rem;
	cursor: pointer;
	opacity: ${(props) => (props.isloading === "true" ? "0.3" : "1")};
`;

const TopPositionDiv = styled.div`
	margin: ${isMobile() ? "10rem 0" : "15rem 0"};
	text-align: center;
	display: flex;
`;

const TopPositionText = styled.div`
	padding: 0 20rem;
	height: ${isMobile() ? "50rem" : "61rem"};
	flex-shrink: 0;
	margin-top: ${isMobile() ? "15rem" : "18rem"};
	border-radius: ${isMobile() ? "15rem" : "20rem"};
	background-color: #6bddaa;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-family: Pretendard;
	font-size: ${isMobile() ? "20rem" : "25rem"};
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	cursor: pointer;
`;

const SmallText = styled.span`
	font-size: ${isMobile() ? "15rem" : "18rem"};
`;
