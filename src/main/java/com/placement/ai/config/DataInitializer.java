package com.placement.ai.config;

import com.placement.ai.entity.*;
import com.placement.ai.repository.*;
import com.placement.ai.service.StudentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final JobPostingRepository jobPostingRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final AptitudeQuestionRepository aptitudeQuestionRepository;
    private final UpskillingResourceRepository upskillingResourceRepository;
    private final StudentService studentService;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           JobPostingRepository jobPostingRepository,
                           InterviewQuestionRepository interviewQuestionRepository,
                           AptitudeQuestionRepository aptitudeQuestionRepository,
                           UpskillingResourceRepository upskillingResourceRepository,
                           StudentService studentService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.interviewQuestionRepository = interviewQuestionRepository;
        this.aptitudeQuestionRepository = aptitudeQuestionRepository;
        this.upskillingResourceRepository = upskillingResourceRepository;
        this.studentService = studentService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // 1. Seed Users
        User studentUser = new User("vivek", "student123", "vivek.sharma@college.edu", "Vivek Sharma", Role.STUDENT, "CSE");
        User tpoUser = new User("tpo", "admin123", "placement.cell@college.edu", "Dr. Rajesh Kulkarni (TPO)", Role.TPO, "Placement Cell");
        User recruiterUser = new User("recruiter", "recruiter123", "talent@google.com", "Sarah Jenkins (Google Tech Recruiting)", Role.RECRUITER, "Campus Hiring");
        User facultyUser = new User("faculty", "faculty123", "faculty.cse@college.edu", "Prof. Ananya Sen", Role.FACULTY, "CSE");

        userRepository.saveAll(Arrays.asList(studentUser, tpoUser, recruiterUser, facultyUser));

        // 2. Seed Primary Student (Vivek Sharma)
        Student vivek = new Student();
        vivek.setUser(studentUser);
        vivek.setRollNumber("2021BCSE042");
        vivek.setName("Vivek Sharma");
        vivek.setEmail("vivek.sharma@college.edu");
        vivek.setDepartment("CSE");
        vivek.setSemester(8);
        vivek.setCgpa(8.85);
        vivek.setTenthPercentage(92.4);
        vivek.setTwelfthPercentage(89.6);
        vivek.setBacklogsCount(0);
        vivek.setSkills("Java, Spring Boot, React, SQL, REST APIs, Git, Docker, Data Structures, Python");
        vivek.setCertifications("Oracle Certified Java SE 11 Developer, AWS Cloud Practitioner");
        vivek.setProjects("AI-Powered Placement Management Portal, Microservices E-Commerce API with Spring Boot & Docker, Real-Time Chat Engine using WebSockets");
        vivek.setTargetRole("Full Stack Developer");
        vivek.setResumeText("Vivek Sharma | 2021BCSE042 | vivek.sharma@college.edu | 9876543210\n" +
                "Education: B.Tech Computer Science & Engineering, CGPA: 8.85\n" +
                "Technical Skills: Java, Spring Boot, REST APIs, Hibernate, PostgreSQL, React, JavaScript, Docker, Git, CI/CD, Data Structures, Algorithms.\n" +
                "Projects:\n" +
                "• AI-Powered Placement Management Portal: Built full-stack platform with ML employability scoring and NLP resume-job matching.\n" +
                "• Microservices Architecture E-Commerce API: Implemented service discovery, API gateway, Docker containers, and JUnit test suites.\n" +
                "Certifications: Oracle Certified Java Associate, AWS Certified Cloud Practitioner.");
        vivek.setPlacementStatus("IN_PROCESS");
        vivek.setAptitudeScore(85.0);
        vivek.setInterviewScore(82.0);
        studentService.saveStudent(vivek);

        // 3. Seed Batch Students across Departments to achieve ~87% overall placement rate matching Fig 3
        seedStudentBatch();

        // 4. Seed Job Postings
        seedJobs();

        // 5. Seed Interview Questions
        seedInterviewQuestions();

        // 6. Seed Aptitude Questions
        seedAptitudeQuestions();

        // 7. Seed Upskilling Resources
        seedUpskillingResources();
    }

    private void seedStudentBatch() {
        // Pre-create realistic batch students for CSE, IT, ECE, MECH, CIVIL
        Object[][] batch = {
                // Name, Roll, Dept, CGPA, Backlogs, Skills, Status, Company, CTC
                {"Aarav Mehta", "2021BCSE001", "CSE", 9.4, 0, "Java, Spring Boot, Kubernetes, AWS, DSA", "PLACED", "Google", 32.0},
                {"Aditi Rao", "2021BCSE002", "CSE", 8.9, 0, "Python, Machine Learning, TensorFlow, SQL", "PLACED", "Microsoft", 28.0},
                {"Rohan Verma", "2021BCSE003", "CSE", 8.6, 0, "React, TypeScript, Node.js, GraphQL", "PLACED", "Amazon", 24.0},
                {"Priya Nair", "2021BCSE004", "CSE", 8.2, 0, "Java, Spring Boot, SQL, Docker", "PLACED", "Flipkart", 18.0},
                {"Kunal Joshi", "2021BCSE005", "CSE", 8.4, 0, "Full Stack, Java, Angular, MongoDB", "PLACED", "Goldman Sachs", 22.0},
                {"Sneha Patil", "2021BCSE006", "CSE", 7.9, 0, "Java, SQL, REST APIs, Git", "PLACED", "TCS Digital", 7.5},
                {"Harsh Gupta", "2021BCSE007", "CSE", 7.5, 0, "Python, Django, SQL, HTML/CSS", "PLACED", "Infosys SP", 9.5},
                {"Neha Kapoor", "2021BCSE008", "CSE", 8.1, 0, "Java, Spring Boot, MySQL", "PLACED", "Accenture", 8.5},
                {"Vikram Singhania", "2021BCSE009", "CSE", 7.2, 0, "C++, Data Structures, Linux", "PLACED", "Cognizant GenC", 7.0},
                {"Ananya Bose", "2021BCSE010", "CSE", 6.8, 1, "HTML, CSS, JavaScript, Basic SQL", "UNPLACED", null, null},

                // IT Department (~88% Placed)
                {"Siddharth Roy", "2021BIT001", "IT", 9.1, 0, "Java, Cloud, AWS, Microservices", "PLACED", "Amazon", 24.0},
                {"Divya Iyer", "2021BIT002", "IT", 8.7, 0, "React, Node.js, PostgreSQL, Docker", "PLACED", "Flipkart", 18.0},
                {"Manish Das", "2021BIT003", "IT", 8.3, 0, "Python, SQL, Tableau, Pandas", "PLACED", "Goldman Sachs", 22.0},
                {"Pooja Kulkarni", "2021BIT004", "IT", 7.8, 0, "Java, Spring Boot, REST APIs", "PLACED", "Infosys SP", 9.5},
                {"Arjun Nair", "2021BIT005", "IT", 8.0, 0, "Cloud DevOps, Linux, Docker, CI/CD", "PLACED", "Accenture", 8.5},
                {"Tanya Sethi", "2021BIT006", "IT", 7.4, 0, "Full Stack Web, JavaScript, SQL", "PLACED", "TCS Digital", 7.5},
                {"Ravi Teja", "2021BIT007", "IT", 7.1, 0, "Python, Flask, MySQL", "PLACED", "Wipro Turbo", 6.5},
                {"Kavita Sen", "2021BIT008", "IT", 7.2, 0, "Java, Spring Boot, Basic Web Dev", "PLACED", "Capgemini", 6.8},

                // ECE Department (~80% Placed)
                {"Rahul Menon", "2021BECE001", "ECE", 8.8, 0, "Embedded Systems, C, C++, IoT, Python", "PLACED", "Qualcomm", 19.5},
                {"Shreya Sharma", "2021BECE002", "ECE", 8.5, 0, "VLSI, Verilog, Digital Electronics", "PLACED", "Texas Instruments", 17.0},
                {"Gaurav Bhat", "2021BECE003", "ECE", 8.0, 0, "C, Python, Linux, Embedded C", "PLACED", "Bosch", 11.0},
                {"Ishita Ghosh", "2021BECE004", "ECE", 7.7, 0, "Java, SQL, Data Structures", "PLACED", "Accenture", 8.5},
                {"Amit Saxena", "2021BECE005", "ECE", 7.3, 0, "Python, IoT, Arduino, Git", "PLACED", "TCS Digital", 7.5},
                {"Meera Pillai", "2021BECE006", "ECE", 6.9, 1, "C, Microcontrollers", "UNPLACED", null, null},

                // MECH Department (~75% Placed)
                {"Nikhil Deshmukh", "2021BME001", "MECH", 8.6, 0, "AutoCAD, SolidWorks, Python, MATLAB", "PLACED", "Tata Motors", 10.5},
                {"Akash Pandey", "2021BME002", "MECH", 8.1, 0, "ANSYS, FEA, Mechanical Design", "PLACED", "L&T Heavy Eng", 9.0},
                {"Rohit Kadam", "2021BME003", "MECH", 7.6, 0, "CAD, Python for Engineering, SQL", "PLACED", "Mahindra & Mahindra", 8.0},
                {"Sanjay Rathore", "2021BME004", "MECH", 6.8, 1, "AutoCAD, Manufacturing Tech", "UNPLACED", null, null},

                // CIVIL Department (~65% Placed)
                {"Varun Reddy", "2021BCE001", "CIVIL", 8.5, 0, "STAAD Pro, AutoCAD, Structural Analysis", "PLACED", "L&T Construction", 9.5},
                {"Deepak Chauhan", "2021BCE002", "CIVIL", 8.0, 0, "Revit, BIM, Project Management", "PLACED", "Shapoorji Pallonji", 8.0},
                {"Pawan Kumar", "2021BCE003", "CIVIL", 6.7, 1, "AutoCAD, Surveying", "UNPLACED", null, null}
        };

        for (Object[] row : batch) {
            String name = (String) row[0];
            String roll = (String) row[1];
            String dept = (String) row[2];
            Double cgpa = (Double) row[3];
            Integer backlogs = (Integer) row[4];
            String skills = (String) row[5];
            String status = (String) row[6];
            String company = (String) row[7];
            Double ctc = (Double) row[8];

            Student s = new Student();
            s.setName(name);
            s.setRollNumber(roll);
            s.setEmail(roll.toLowerCase() + "@college.edu");
            s.setDepartment(dept);
            s.setSemester(8);
            s.setCgpa(cgpa);
            s.setTenthPercentage(cgpa * 9.5);
            s.setTwelfthPercentage(cgpa * 9.2);
            s.setBacklogsCount(backlogs);
            s.setSkills(skills);
            s.setCertifications(status.equals("PLACED") ? "Industry Certification in " + dept : "Foundation Course");
            s.setProjects(dept + " Capstone Senior Project");
            s.setTargetRole(dept.equals("CSE") || dept.equals("IT") ? "Software Engineer" : dept + " Engineer");
            s.setPlacementStatus(status);
            s.setPlacedCompany(company);
            s.setOfferedCtcLpa(ctc);
            s.setAptitudeScore(cgpa * 9.8);
            s.setInterviewScore(cgpa * 9.5);

            studentService.saveStudent(s);
        }
    }

    private void seedJobs() {
        JobPosting j1 = new JobPosting();
        j1.setTitle("Software Development Engineer - Cloud Backend");
        j1.setCompany("Google");
        j1.setDescription("Looking for high-caliber engineers to build scalable distributed backend services, high-throughput pipelines, and cloud APIs. Candidates will work with cutting-edge microservices architectures.");
        j1.setRequiredSkills("Java, Spring Boot, Data Structures, Algorithms, SQL, REST APIs");
        j1.setNiceToHaveSkills("Docker, Kubernetes, GCP, Microservices");
        j1.setDepartmentEligibility("CSE,IT,ECE");
        j1.setMinCgpa(8.0);
        j1.setMaxBacklogs(0);
        j1.setLocation("Bangalore / Hyderabad");
        j1.setCtcLpa(32.0);
        j1.setDriveDate(LocalDate.now().plusDays(10));
        j1.setApplicationDeadline(LocalDate.now().plusDays(5));
        j1.setStatus("OPEN");
        j1.setPostedBy("Google Talent Team");

        JobPosting j2 = new JobPosting();
        j2.setTitle("Full Stack Cloud Engineer");
        j2.setCompany("Microsoft");
        j2.setDescription("Join Microsoft Azure team developing next-gen cloud portal applications, client-facing web architectures, and high-performance serverless microservices.");
        j2.setRequiredSkills("React, TypeScript, Java, Spring Boot, REST APIs, Git");
        j2.setNiceToHaveSkills("Azure, Docker, CI/CD, GraphQL");
        j2.setDepartmentEligibility("CSE,IT");
        j2.setMinCgpa(7.5);
        j2.setMaxBacklogs(0);
        j2.setLocation("Bangalore / Noida");
        j2.setCtcLpa(28.0);
        j2.setDriveDate(LocalDate.now().plusDays(14));
        j2.setApplicationDeadline(LocalDate.now().plusDays(8));
        j2.setStatus("OPEN");
        j2.setPostedBy("Microsoft University Hiring");

        JobPosting j3 = new JobPosting();
        j3.setTitle("SDE 1 - Core Platform Services");
        j3.setCompany("Amazon");
        j3.setDescription("Build mission-critical e-commerce infrastructure supporting millions of concurrent users worldwide. Design resilient APIs and high-availability database schemas.");
        j3.setRequiredSkills("Java, Data Structures, Algorithms, SQL, System Design");
        j3.setNiceToHaveSkills("AWS, DynamoDB, Microservices");
        j3.setDepartmentEligibility("CSE,IT,ECE");
        j3.setMinCgpa(7.0);
        j3.setMaxBacklogs(0);
        j3.setLocation("Hyderabad / Bangalore");
        j3.setCtcLpa(24.0);
        j3.setDriveDate(LocalDate.now().plusDays(18));
        j3.setApplicationDeadline(LocalDate.now().plusDays(12));
        j3.setStatus("OPEN");
        j3.setPostedBy("Amazon Campus Recruiter");

        JobPosting j4 = new JobPosting();
        j4.setTitle("Specialist Programmer (Digital Core)");
        j4.setCompany("Infosys");
        j4.setDescription("Design modern web and enterprise microservices applications using full-stack frameworks, database design, and cloud deployments.");
        j4.setRequiredSkills("Java, Spring Boot, SQL, Python, REST APIs");
        j4.setNiceToHaveSkills("Docker, Angular, Git");
        j4.setDepartmentEligibility("ALL");
        j4.setMinCgpa(6.5);
        j4.setMaxBacklogs(1);
        j4.setLocation("Pune / Bangalore / Chennai");
        j4.setCtcLpa(9.5);
        j4.setDriveDate(LocalDate.now().plusDays(22));
        j4.setApplicationDeadline(LocalDate.now().plusDays(15));
        j4.setStatus("OPEN");
        j4.setPostedBy("Infosys Talent Acquisition");

        JobPosting j5 = new JobPosting();
        j5.setTitle("Digital Innovator");
        j5.setCompany("Tata Consultancy Services");
        j5.setDescription("Work on digital transformation initiatives spanning cloud migration, automation pipelines, and modern web application development.");
        j5.setRequiredSkills("Java, Python, SQL, Git, Web Basics");
        j5.setNiceToHaveSkills("Spring Boot, Docker, Linux");
        j5.setDepartmentEligibility("ALL");
        j5.setMinCgpa(6.0);
        j5.setMaxBacklogs(1);
        j5.setLocation("Pan India");
        j5.setCtcLpa(7.5);
        j5.setDriveDate(LocalDate.now().plusDays(25));
        j5.setApplicationDeadline(LocalDate.now().plusDays(18));
        j5.setStatus("OPEN");
        j5.setPostedBy("TCS Campus Connect");

        JobPosting j6 = new JobPosting();
        j6.setTitle("Advanced App Engineering Analyst");
        j6.setCompany("Accenture");
        j6.setDescription("Design, build, and configure enterprise applications to meet business process and application requirements.");
        j6.setRequiredSkills("Java, Spring Boot, SQL, REST APIs, Git");
        j6.setNiceToHaveSkills("Cloud, Agile, CI/CD");
        j6.setDepartmentEligibility("CSE,IT,ECE");
        j6.setMinCgpa(6.5);
        j6.setMaxBacklogs(0);
        j6.setLocation("Gurgaon / Bangalore");
        j6.setCtcLpa(8.5);
        j6.setDriveDate(LocalDate.now().plusDays(30));
        j6.setApplicationDeadline(LocalDate.now().plusDays(20));
        j6.setStatus("OPEN");
        j6.setPostedBy("Accenture Recruitment");

        jobPostingRepository.saveAll(Arrays.asList(j1, j2, j3, j4, j5, j6));
    }

    private void seedInterviewQuestions() {
        InterviewQuestion q1 = new InterviewQuestion(
                "TECHNICAL", "Spring Boot",
                "Explain the concept of Inversion of Control (IoC) and Dependency Injection (DI) in Spring Boot. What are the key advantages?",
                "inversion of control, dependency injection, loose coupling, applicationcontext, bean lifecycle, autowired, testing",
                "Inversion of Control (IoC) is a design principle where the control of object creation and lifecycle management is shifted from the programmer to the Spring container (ApplicationContext). Dependency Injection (DI) is the pattern used to implement IoC, where dependencies are injected via constructor, setter, or field injection. Key advantages include loose coupling, increased modularity, simplified unit testing with mocks, and streamlined component lifecycle management.",
                "MEDIUM"
        );

        InterviewQuestion q2 = new InterviewQuestion(
                "TECHNICAL", "Java & Concurrency",
                "How does the JVM handle Garbage Collection, and what is the difference between String, StringBuilder, and StringBuffer?",
                "garbage collection, mark and sweep, heap memory, young generation, old generation, immutable, thread-safe, synchronized, stringbuilder",
                "The JVM manages memory via Garbage Collection operating on the Heap. It divides memory into Young (Eden, Survivor) and Old (Tenured) generations, using algorithms like Mark-and-Sweep. String is immutable and stored in the String Pool. StringBuilder is mutable and not thread-safe (high performance for single-threaded string concatenation), while StringBuffer is mutable and thread-safe due to synchronized methods.",
                "MEDIUM"
        );

        InterviewQuestion q3 = new InterviewQuestion(
                "TECHNICAL", "System Design & Architecture",
                "How would you design a scalable RESTful API with database indexing to handle 10,000 requests per second?",
                "restful api, stateless, caching, redis, load balancer, database indexing, b-tree, connection pooling, horizontal scaling",
                "To handle 10k RPS: 1) Design stateless REST APIs horizontally scaled behind an NGINX or AWS ALB load balancer. 2) Implement an in-memory caching layer using Redis for read-heavy operations. 3) Apply B-Tree database indexing on frequently queried foreign keys and filter columns while avoiding over-indexing on write-heavy tables. 4) Use HikariCP connection pooling, asynchronous message queues (Kafka/RabbitMQ) for write spikes, and database read replicas.",
                "HARD"
        );

        InterviewQuestion q4 = new InterviewQuestion(
                "BEHAVIORAL", "STAR Technique & Leadership",
                "Describe a situation where a technical project fell behind schedule or faced an unexpected bug. How did you resolve it?",
                "situation, task, action, result, root cause analysis, communication, prioritisation, testing, git",
                "In my previous semester capstone project, our team faced a severe latency bottleneck 5 days before the presentation due to unindexed N+1 database queries. Using the STAR method: Situation was the upcoming deadline; Task was to reduce API response latency from 3.2s to sub-200ms; Action: I profiled the queries, added Hibernate batch fetching, implemented Redis caching, and led nightly standups; Result: Latency plummeted to 120ms and we secured an 'A' grade.",
                "EASY"
        );

        InterviewQuestion q5 = new InterviewQuestion(
                "TECHNICAL", "Database & SQL",
                "What are ACID properties in relational databases, and what are the differences between clustered and non-clustered indexes?",
                "acid, atomicity, consistency, isolation, durability, clustered index, leaf nodes, non-clustered index, b-tree",
                "ACID stands for Atomicity (all-or-nothing transactions), Consistency (database transitions from one valid state to another), Isolation (concurrent transactions execute independently), and Durability (committed data persists across failures). A clustered index defines the physical order of data on disk (only 1 per table, usually primary key), whereas a non-clustered index stores pointers to physical rows and multiple can exist.",
                "MEDIUM"
        );

        interviewQuestionRepository.saveAll(Arrays.asList(q1, q2, q3, q4, q5));
    }

    private void seedAptitudeQuestions() {
        AptitudeQuestion a1 = new AptitudeQuestion(
                "QUANTITATIVE",
                "A train running at 72 km/h crosses a 260m long platform in 23 seconds. What is the length of the train?",
                "200 meters", "220 meters", "240 meters", "260 meters",
                "A",
                "Speed = 72 km/h = 72 * (5/18) = 20 m/s. Total distance = Speed * Time = 20 * 23 = 460m. Train length = Total distance - Platform length = 460 - 260 = 200 meters."
        );

        AptitudeQuestion a2 = new AptitudeQuestion(
                "LOGICAL",
                "In a code language, if 'SPRING' is written as 'UNPINH', how is 'FLOWER' written in that language?",
                "HNQYGT", "HNRXGT", "GMPXFS", "HLPXES",
                "A",
                "Each letter follows pattern +2, -2, +2, -2... S(+2)=U, P(-2)=N, R(+2)=T/P etc. Applying to FLOWER: F(+2)=H, L(+2)=N, O(+2)=Q, W(+2)=Y, E(+2)=G, R(+2)=T -> HNQYGT."
        );

        AptitudeQuestion a3 = new AptitudeQuestion(
                "TECHNICAL_MCQ",
                "What is the average time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?",
                "O(1)", "O(log n)", "O(n)", "O(n log n)",
                "B",
                "In a balanced BST, the height of the tree is bounded by O(log n), so search, insertion, and deletion operations all take O(log n) time in average and worst case."
        );

        AptitudeQuestion a4 = new AptitudeQuestion(
                "VERBAL",
                "Choose the word closest in meaning to 'PRAGMATIC':",
                "Idealistic", "Practical", "Theoretical", "Hesitant",
                "B",
                "Pragmatic means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations."
        );

        AptitudeQuestion a5 = new AptitudeQuestion(
                "TECHNICAL_MCQ",
                "Which Spring Boot annotation is used to create a bean that is loaded only if another specific bean is not already registered?",
                "@ConditionalOnMissingBean", "@ConditionalOnClass", "@Primary", "@Qualifier",
                "A",
                "@ConditionalOnMissingBean is a Spring Boot condition annotation used in auto-configuration classes to define default beans that can be easily overridden by developers."
        );

        aptitudeQuestionRepository.saveAll(Arrays.asList(a1, a2, a3, a4, a5));
    }

    private void seedUpskillingResources() {
        UpskillingResource r1 = new UpskillingResource(
                "Docker", "Docker & Kubernetes Bootcamp",
                "Master containerization, Dockerfiles, docker-compose, and Kubernetes pods, deployments, and services.",
                "COURSE", "Udemy & freeCodeCamp", "https://docker.com/get-started", "12 hours", "INTERMEDIATE"
        );

        UpskillingResource r2 = new UpskillingResource(
                "Spring Boot", "Building Enterprise Microservices with Spring Boot 3",
                "Deep dive into Spring Data JPA, Spring Security, RESTful Web Services, and Microservices patterns.",
                "TUTORIAL", "Baeldung / Spring.io", "https://spring.io/guides", "18 hours", "ADVANCED"
        );

        UpskillingResource r3 = new UpskillingResource(
                "Data Structures", "NeetCode 150 & LeetCode DSA Patterns",
                "Systematic algorithm mastery: Sliding window, two pointers, graphs, dynamic programming, and heaps.",
                "PRACTICE", "LeetCode & NeetCode", "https://neetcode.io", "30 hours", "INTERMEDIATE"
        );

        UpskillingResource r4 = new UpskillingResource(
                "System Design", "System Design Primer & Scalability Foundations",
                "Learn how to architect large-scale distributed systems, load balancing, caching strategies, and data sharding.",
                "DOCUMENTATION", "GitHub System Design Primer", "https://github.com/donnemartin/system-design-primer", "15 hours", "ADVANCED"
        );

        UpskillingResource r5 = new UpskillingResource(
                "React", "Modern React 18 & TypeScript Masterclass",
                "Component architecture, hooks (useState, useEffect, useMemo), state management, and Tailwind CSS.",
                "COURSE", "React Official Docs & YouTube", "https://react.dev/learn", "14 hours", "BEGINNER"
        );

        UpskillingResource r6 = new UpskillingResource(
                "AWS", "AWS Certified Cloud Practitioner Essentials",
                "Fundamental cloud concepts: EC2, S3, RDS, IAM, VPC, serverless Lambda, and cost optimization.",
                "COURSE", "AWS Skill Builder", "https://aws.amazon.com/training", "10 hours", "BEGINNER"
        );

        upskillingResourceRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5, r6));
    }
}
