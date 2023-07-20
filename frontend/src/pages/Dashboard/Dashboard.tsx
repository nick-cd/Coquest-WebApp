import React from "react";
import WelcomeMessage from "../../components/WelcomeMessage";
import SearchBar from "../../components/SearchBar";
import SimpleCard from "../../components/SimpleCard/SimpleCard";
import Stack from "@mui/material/Stack";
import styled from "@emotion/styled";
import MyTasksContainer from "../../components/MyTasksContainer";
import Maps from "../../components/Maps/Maps";
import PostContainer, { ImageBoxes } from "../../components/PostsContainer";
import CommunityTasks from "../../components/CommunityTasks";
import Members, { MemberProps } from "../../components/Members";

const Container = styled("div")({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
});

const SearchContainer = styled("div")({});

const Header = styled("div")({
	width: "90%",
	padding: 20,
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
});

function Dashboard() {
	return (
		<Container>
			<Header>
				<WelcomeMessage
					name="John Dory"
					communityName="Community name"
				/>
				<SearchContainer>
					<SearchBar />
				</SearchContainer>
			</Header>
			{/* <div
				className="container"
				style={{
					left: "134px",
					top: "52px",
					position: "relative",
				}}
			>
				<Stack spacing={1.8}>
					<SimpleCard label="Community overview" />
					<SimpleCard label="My projects" />
					<SimpleCard label="Open projects" />
				</Stack>
			</div>
			<div
				style={{
					left: "550px",
					bottom: "166px",
					position: "relative",
				}}
			>
				<MyTasksContainer label="My Tasks" seeAllLink="#" />
			</div>
			<div
				style={{
					position: "relative",
					left: "870px",
					bottom: "820px",
				}}
			>
				<Maps />
			</div>
			<div
				style={{
					position: "relative",
					left: "215px",
					bottom: "1240px",
				}}
			>
				<PostContainer header="Posts"></PostContainer>
			</div>
			<div
				style={{
					position: "relative",
					left: "214px",
					bottom: "1220px",
				}}
			>
				<CommunityTasks />
			</div>
			<div
				style={{
					position: "relative",
					left: "867px",
					bottom: "1548px",
				}}
			>
				<Members
					users={["You", "Username", "Username", "Username"]}
					showAllLink="#"
					userRole={["Role", "Role", "Role", "Role"]}
				/>
			</div> */}
		</Container>
	);
}

export default Dashboard;
