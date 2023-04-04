// describe("ProjectsService", () => {
//   /** dependency instances */
//   let service: ProjectsService;
//   let _usersService: UsersService;

//   /** mock variables and objects */
//   const _mockProject = {
//     name: "Project 1",
//     area: "it",
//     description: "Project 1 description",
//     keywords: ["keyword1", "keyword2"],
//     manager: "John Doe",
//     teamSize: 5,
//     teamMembers: ["John Doe", "Jane Doe"],
//     status: "open",
//     applicationDeadline: new Date("2023-03-31"),
//     startDate: new Date("2023-04-01"),
//     endDate: new Date("2023-04-30"),
//   };

//   const _mockUser = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     jobTitle: "Software Engineer",
//     city: "New York",
//     country: "USA",
//   };

//   /** mock dependency instances and module */
//   beforeAll(() => {
//     rmSync(path.join(__dirname, "../../db/test.sqlite"), {
//       recursive: true,
//       force: true,
//     });
//   });

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         TypeOrmModule.forRoot({
//           type: "sqlite",
//           database: path.join(__dirname, "../../db/test.sqlite"),
//           entities: [Project, User],
//           synchronize: true,
//         }),
//         TypeOrmModule.forFeature([Project, User]),
//       ],
//       providers: [ProjectsService, UsersService],
//     }).compile();

//     service = module.get<ProjectsService>(ProjectsService);
//     _usersService = module.get<UsersService>(UsersService);
//   });

//   /** test suite */
//   it("can create an instance of ProjectsService", () => {
//     expect(service).toBeDefined();
//   });

//   it("should create a new project", async () => {
//     const _user = await _usersService.create(_mockUser);

//     const _project = await service.create(_mockProject, _user);
//     expect(_project).toBeDefined();
//     expect(_project).toHaveProperty("id");
//     expect(_project).toHaveProperty("name", _mockProject.name);
//     expect(_project).toHaveProperty("area", _mockProject.area);
//     expect(_project).toHaveProperty("description", _mockProject.description);
//     expect(_project).toHaveProperty("keywords", _mockProject.keywords);
//     expect(_project).toHaveProperty("manager", _user);
//     expect(_project).toHaveProperty("teamSize", _mockProject.teamSize);
//     expect(_project).toHaveProperty("teamMembers", _mockProject.teamMembers);
//     expect(_project).toHaveProperty("status", _mockProject.status);
//   });

//   it("should throw a BadRequestException if the project already exists", async () => {
//     await expect(
//       service.create(_mockProject, _mockUser as User)
//     ).rejects.toThrow(new BadRequestException("Project already exists"));
//   });

//   it("should throw a NotFoundException if the project does not exist", async () => {
//     await expect(service.findOne(0)).rejects.toThrow(
//       new NotFoundException("Project not found")
//     );
//   });

//   it("should return an array of projects", async () => {
//     const _projects = await service.findAll();
//     expect(_projects).toBeDefined();
//     expect(_projects).toHaveLength(1);
//   });

//   it("should return a project by name", async () => {
//     const _project = await service.findAll(_mockProject.name);
//     expect(_project).toBeDefined();
//     expect(_project).toHaveLength(1);
//   });

//   it("should return a project by id", async () => {
//     const _project = await service.findOne(1);
//     expect(_project).toBeDefined();
//     expect(_project).toHaveProperty("id");
//   });

//   it("should update a project", async () => {
//     const _project = await service.update(1, {
//       name: "Project 2",
//       description: "Project 2 description",
//     });
//     expect(_project).toBeDefined();
//     expect(_project).toHaveProperty("id");
//     expect(_project).toHaveProperty("name", "Project 2");
//     expect(_project).toHaveProperty("area", _mockProject.area);
//     expect(_project).toHaveProperty("description", "Project 2 description");
//     expect(_project).toHaveProperty("keywords", _mockProject.keywords);
//     expect(_project).toHaveProperty("teamSize", _mockProject.teamSize);
//     expect(_project).toHaveProperty("teamMembers", _mockProject.teamMembers);
//     expect(_project).toHaveProperty("status", _mockProject.status);
//   });

//   it("should throw a BadRequestException if the project does not exist", async () => {
//     await expect(service.update(0, {})).rejects.toThrow(
//       new BadRequestException("Project not found")
//     );
//   });

//   it("should delete a project", async () => {
//     await expect(service.remove(1)).resolves.toBeUndefined();
//   });

//   it("should throw a BadRequestException if the project does not exist", async () => {
//     await expect(service.remove(0)).rejects.toThrow(
//       new BadRequestException("Project not found")
//     );
//   });

//   it("should return an empty array of projects", async () => {
//     const _projects = await service.findAll();
//     expect(_projects).toBeDefined();
//     expect(_projects).toHaveLength(0);
//   });
// });
