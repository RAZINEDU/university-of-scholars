import { TeacherInfo } from "@/types/routine";

export interface EducationItem {
  degree: string;
  institute: string;
  year?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration?: string;
}

export interface PublicationItem {
  title: string;
  url?: string;
}

export interface FacultyMember extends TeacherInfo {
  serial: number;
  slug: string;
  cleanSlug: string;
  profileUrl?: string;
  officeAddress?: string;
  bio?: string;
  researchInterests?: string[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
  publications?: PublicationItem[];
}

export type FacultyProfile = FacultyMember;

// All 27 Faculty Members of CSE Department from IUS (https://ius.edu.bd/faculty-list/1/1)
export const CSE_FACULTY_MEMBERS: FacultyMember[] = [
  {
    "serial": 1,
    "slug": "engr.-md.-ahsan-arif",
    "cleanSlug": "engr-md-ahsan-arif",
    "code": "MAA",
    "name": "Engr. Md. Ahsan Arif",
    "designation": "Associate Professor & Head of the Department",
    "department": "Department of Computer Science and Engineering",
    "phone": "01711-787147",
    "email": "ahsan@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/engr.-md.-ahsan-arif",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628522/ius_faculty/eylkudgmeithba6u79ql.png",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, 40, Bulu Ocean Tower, Kemal Ataturk Avenue, Banani, Dhaka",
    "bio": "",
    "researchInterests": [
      "Machine Learning",
      "Data Science",
      "the Internet of Things",
      "Artificial Intelligence",
      "Natural Language Processing"
    ],
    "education": [],
    "experience": [
      {
        "role": "Associate Professor &amp; HEAD",
        "company": "University of Scholars",
        "duration": "October 2021- till date"
      },
      {
        "role": "Associate Professor &amp; HEAD",
        "company": "AUB",
        "duration": "2019- OCT 2021"
      },
      {
        "role": "Associate Professor",
        "company": "AUB",
        "duration": "2017-2019"
      },
      {
        "role": "Assistant Professor &amp; Director IT-cum-Advisor, Digital Marketing",
        "company": "AUB",
        "duration": "2016-2017"
      },
      {
        "role": "Assistant Professor &amp; Director IT",
        "company": "AUB",
        "duration": "2015-2016"
      },
      {
        "role": "Assistant Professor",
        "company": "AUB",
        "duration": "2010-2015"
      },
      {
        "role": "Senior Lecturer",
        "company": "AUB",
        "duration": "2008-2010"
      },
      {
        "role": "Lecturer &amp; DBA",
        "company": "AUB",
        "duration": "2005-2008"
      },
      {
        "role": "Adjunct Faculty",
        "company": "ASAUB",
        "duration": "--"
      },
      {
        "role": "Adjunct Faculty",
        "company": "SU",
        "duration": "--"
      },
      {
        "role": "Adjunct Faculty",
        "company": "PU",
        "duration": "--"
      }
    ],
    "publications": [
      {
        "title": "An Improved Prediction System of Students' Performance Using Classification model and Feature Selection Algorithm.",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:roLk4NBRz8UC"
      },
      {
        "title": "An Empirical Analysis of C#, PHP, JAVA, JSP and ASP.Net regarding performance analysis based on CPU utilization",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:Tyk-4Ss8FVUC"
      },
      {
        "title": "Problems and Prospects: Universal Networking Language on Bangla Sentence Structure Perspective",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:u5HHmVD_uO8C"
      },
      {
        "title": "An operational design of indoor tracking system in the environment of GSM structure",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:2osOgNQ5qMEC"
      },
      {
        "title": "Mining structured objects (data records) based on maximum region detection by text content comparison from website",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:d1gkVwhDpl0C"
      },
      {
        "title": "A Machine Learning technique to analyze and detect Corona Virus",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:0EnyYjriUFMC"
      },
      {
        "title": "A Brief Analysis of Bengali Natural Language Processing: Universal Networking Language Perspective",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:_FxGoFyzp5QC"
      },
      {
        "title": "Pervasive, Embedded Models for E-Business",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:Y0pCki6q_DkC"
      },
      {
        "title": "An Algorithmic Approach to Develop Auto Translation System-Bengali to English",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:u-x6o8ySG0sC"
      },
      {
        "title": "Integration Between Artificial Intelligence and Bengali Language Processing",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:zYLM7Y9cAGgC"
      },
      {
        "title": "Algorithm for Natural Language Processing: Bengali Language Perspective",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:IjCSPb-OGe4C"
      },
      {
        "title": "A Survey on Delay of Voice End User in Micro Macro Cellular System",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:9yKSN-GCB0IC"
      },
      {
        "title": "Quality of Service (QOS) in Wireless Network",
        "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:UeHWp8X0CEIC"
      }
    ]
  },
  {
    "serial": 2,
    "slug": "mamoon-al-rasheed",
    "cleanSlug": "mamoon-al-rasheed",
    "code": "MAR",
    "name": "Mamoon Al Rasheed",
    "designation": "Associate Professor & Director IQAC",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/mamoon-al-rasheed",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628524/ius_faculty/q2qac8smq02cyq6qvpok.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 3,
    "slug": "dr.-rowsanara-akhter",
    "cleanSlug": "dr-rowsanara-akhter",
    "code": "DRA",
    "name": "Dr. Rowsanara Akhter",
    "designation": "Associate Professor",
    "department": "Department of Computer Science and Engineering",
    "phone": "01716-895607",
    "email": "dr.rowsanara@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/dr.-rowsanara-akhter",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628528/ius_faculty/rlaipriombiydzc36tes.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "Ph. D",
        "institute": "Jahangirnagar University",
        "year": "2014"
      },
      {
        "degree": "M. Phil",
        "institute": "Bangladesh University of Engineering and Technology",
        "year": "2009"
      },
      {
        "degree": "M. Sc.",
        "institute": "Jahangirnagar University",
        "year": "2000"
      },
      {
        "degree": "B. Sc.",
        "institute": "Jahangirnagar University",
        "year": "1999"
      },
      {
        "degree": "HSC",
        "institute": "Gazipur Mohila College",
        "year": "1996"
      },
      {
        "degree": "SSC",
        "institute": "Joydebpur Govt. Girls High School",
        "year": "1994"
      }
    ],
    "experience": [
      {
        "role": "The International University of Scholars",
        "company": "Associate Professor",
        "duration": "October 1st, 2022, to till now"
      },
      {
        "role": "The International University of Scholars",
        "company": "Assistant Professor",
        "duration": "March 01, 2019, to September 30, 2022"
      },
      {
        "role": "The International University of Scholars",
        "company": "Lecturer",
        "duration": "February 1, 2017, to February 28, 2019"
      }
    ],
    "publications": [
      {
        "title": "Rowsanara Akhter, Mohammad Mokaddes Ali, and Md Abdul Alim, Data analysis of thermal performance and irreversibility of convective flow in porous-wavy channel having triangular obstacle under magnetic field effect, Heliyon, 10, e34580 , 2024 (Q1, IF- 3.4, Elsevier, Scopus Indexed). https://doi.org/10.1016/j.heliyon.2024.e34580",
        "url": "https://doi.org/10.1016/j.heliyon.2024.e34580"
      },
      {
        "title": "Rowsanara Akhter , Mohammad Mokaddes Ali, and Md Abdul Alim. Magnetic field impact on double diffusive mixed convective hybrid-nanofluid flow and irreversibility in porous cavity with vertical wavy walls and rotating solid cylinder. Results in Engineering, 19, 101292, (16 July 2023) https://doi.org/10.1016/j.rineng.2023.101292 (Q2, Elsevier). IF: 5.0, ESCI and Scopus Indexed.",
        "url": "https://doi.org/10.1016/j.rineng.2023.101292"
      },
      {
        "title": "Rowsanara Akhter, Mohammad Mokaddes Ali, Md. Motawakkel Billah, Md. Nasir Uddin, Hybrid-nanaofluid mixed convection in square cavity subjected to oriented magnetic field and multiple rotating rough cylinders, Results in Engineering, 18(101100) 2023. https://doi.org/10.1016/j.rineng.2023.101100 (Q1, Elsevier). IF: 5.0, ESCI and Scopus Indexed.",
        "url": "https://doi.org/10.1016/j.rineng.2023.101100(Q1,"
      },
      {
        "title": "Rowsanara Akhter, Mohammad Mokaddes Ali, and Md Abdul Alim. Entropy generation due to hydromagnetic buoyancy-driven hybrid-nanofluid flow in partially heated porous cavity containing heat conductive obstacle.Alexandria Engineering Journal, 62, 17-45, 2023 (Online 4 Aug 2022). (Q1, Elsevier). IF:6.8, SCIE Indexed.",
        "url": "https://www.sciencedirect.com/topics/engineering/natural-convection"
      },
      {
        "title": "M. M. Ali, Rowsanara Akhter, M M Alim, M. M Miah, Magnetic- Mixed Convection in nanofluid-filled cavity containing baffles and rotating hollow-cylinders with roughness components. Mathematical Problems in Engineering, 2022. (14 December 2022). http://doi.org/10.1155/2022/3044930 (Q2). CS: 2.1, Scopus Indexed.",
        "url": "http://doi.org/10.1155/2022/3044930"
      },
      {
        "title": "M. M. Ali, Rowsanara Akhter, M. M. Miah, Hydromagnetic mixed convective flow in a horizontal channel equipped with Cu-water nanofluid and alternated baffles. International Journal of Thermofluids, 12, 100118, November 2021. (Q4).",
        "url": "https://www.sciencedirect.com/topics/engineering/convective-flow"
      },
      {
        "title": "Mohammad Mokaddes Ali, S. Rushd, Rowsanara Akhter, M.A. Alim, Magneto-hydrodynamic mixed convective heat transfer in a nanofluid filled wavy conduit having rotating cylinders. Scientia Iranica, 29(2), 486-501, 2022 (online 5 October 2021). 10.24200/SCI.2021.56422.4717 (Q2). IF: 1.416, SCIE and Scopus Indexed.",
        "url": ""
      },
      {
        "title": "M. Ali, Rowsanara Akhter , M. M. Miah, Hydromagnetic mixed convective flow in a horizontal channel equipped with Cu-water nanofluid and alternated baffles. Int. Journal of Thermofluids, 12, 100118, Nov 2021. 10.1016/j.ijft.2021.100118 (Q1, Elsevier). CS: 9.2, Scopus Indexed.",
        "url": "https://doi.org/10.1016/j.ijft.2021.100118"
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter and Md Abdul Alim, Hydromagnetic mixed convection in a triangular shed filled by nanofluid and equipped with rectangular heater and rotating cylinders. International Journal of Thermofluids, 100105, August, 2021. https://doi.org/10.1016/j.ijft.2021.100105 (Q1, Elsevier). CS: 9.2, Scopus Indexed.",
        "url": "https://doi.org/10.1016/j.ijft.2021.100105"
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter and Md Abdul Alim, Hydromagnetic natural convection in a wavy-walled enclosure equipped with hybrid nanofluid and heat generating cylinder. Alexandria Engineering Journal, 60(6), 5245-5264, 2021. https://doi.org/10.1016/j.aej.2021.04.059 (Q1, Elsevier). IF:6.8, SCIE Indexed.",
        "url": "https://doi.org/10.1016/j.aej.2021.04.059"
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter and Md Abdul Alim, Magneto-mixed convection in a lid driven partially heated cavity equipped with nanofluid and rotating flat plate. Alexandria Engineering Journal, 61(1), 257-278, 2022 (online 6 June 2021). https://doi.org/10.1016/j.aej.2021.05.003 (Q1, Elsevier). IF:6.8, SCIE Indexed.",
        "url": "https://doi.org/10.1016/j.aej.2021.05.003"
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter and Md Abdul Alim. &ldquo;Performance of flow and heat transfer analysis of mixed convection in Casson fluid filled lid driven cavity including solid obstacle with magnetic impact.&rdquo; SN Applied Sciences, 3 (2),1-15, 2021. https://doi.org/10.1007/s42452-021-04243-x (Q2, Springer). IF:2.6, ESCI and Scopus Indexed.",
        "url": "https://doi.org/10.1007/s42452-021-04243-x"
      },
      {
        "title": "Rowsanara Akhter , Mohammad Mokaddes Ali, Md Abdul Alim, M. A. Maleque, M .M Ali, Magnetohydrodynamic mixed convection in a nanofluid filled tubular enclosure, Fluid Mechanics Research International Journal, Vol.4, Issue 1, 2020 . DOI: 10.15406/fmrij.2020.04.00058",
        "url": "https://doi.org/10.15406/fmrij.2020.04.00058"
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter, and Md Abdul Alim. \"MHD natural convection and entropy generation in a grooved enclosure filled with nanofluid using two-component non-homogeneous model.\" SN Applied Sciences, Vol. 2, no. 4 (2020): 1-25. https://doi.org/10.1007/s42452-020-2319-x (Q2, Springer). IF:2.6, ESCI and Scopus Indexed.",
        "url": "https://doi.org/10.1007/s42452-020-2319-x"
      },
      {
        "title": "Rowsanara Akhter , Mohammad Mokaddes Ali, and Md Abdul Alim. \"Hydromagnetic Natural Convection Heat Transfer in a Partially Heated Enclosure Filled with Porous Medium Saturated by Nanofluid.\" International Journal of Applied and Computational Mathematics, Vol 5, no. 3 ( 2019 ): 52. https://doi.org/10.1007/s40819-019-0638-7 (Q3, Springer). Scopus Indexed.",
        "url": "https://doi.org/10.1007/s40819-019-0638-7"
      },
      {
        "title": "Rowsanara Akhter , Mohammad Mokaddes Ali, Md. Babul Hossain, Md. Musa Miah, MHD Free Convection Boundary Layer Flow over an Inclined Heated Flat Plate with Thermal Radiation Effect, American Journal of Fluid Dynamics, Vol.7(2), pp.4-48, 2017 . doi:10.5923/j.ajfd.20170702.01",
        "url": ""
      },
      {
        "title": "Mohammad Mokaddes Ali1, Md. Abdul Alim, Rowsanara Akhter , Syed Sabbir Ahmed, MHD Natural Convection Flow of CuO/Water Nanofluid in a Differentially Heated Hexagonal Enclosure with a Tilted Square Block, International Journal of Applied and Computational Mathematics, Vol.3, pp.1047-1069, 2017. https://doi.org/10.1007/s40819-017-0400-y (Q3, Springer). and Scopus Indexed.",
        "url": "https://doi.org/10.1007/s40819-017-0400-y"
      },
      {
        "title": "Rowsanara Akhter , Mohammad Mokaddes Ali, M. Sharif Uddin, A. R. Khan, Heat Generation Effect on Convective Heat Transfer for Cylinder with Radiative Heat Transfer, Journal of Science and Technology (ISSN 2079-472X),Vol.5(1),pp.75-84, 2015 .(Printed copy: Mawlana Bhashani Science and Tech. Uni. Tangail, Journal)",
        "url": ""
      },
      {
        "title": "Rowsanara Akhter , Mohammad Mokaddes Ali, Md. Babul Hossain, M. Sharif Uddin, Conjugate Effect of Radiation and Thermal Conductivity Variation on MHD Free Convection Flow for a Vertical Plate, American Journal of Computational Mathematics, Vol.3, pp.252-259, 2013 . 4236/ajcm.2013.33035",
        "url": "http://dx.doi.org/10.4236/ajcm.2013.33035"
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter , NHM A Azim, M. A. Maleque, Effects of radiation and viscous dissipation conjugate free convection flow along a vertical flat plate, Journal of Science and Technology (ISSN 2079-472X), Vol.1(1), pp.11-21,2011. (Printed copy: Mawlana Bhashani Science and Tech. Uni. Tangail, Journal)",
        "url": ""
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter , NHM. A. Azim, M. A. Maleque, The Effects of Radiation and Heat Generation on MHD Natural Convection Flow Along a Vertical Flat Plate in Presence of Viscous Dissipation, Daffodil International University Journal of Science and Technology, Vol.6, Issue 01, January 2011. https://doi.org/10.3329/diujst.v6i1.9330",
        "url": ""
      },
      {
        "title": "M. Ali, R. Akhter , N.H.M.A. Azim, M.I. Abdullah, The Effects of Radiation and Viscous Dissipation on MHD Natural Convection Flow along a Vertical Flat Plate in Presence of Joule Heating, Journal of Applied Science and Technology, (ISSN 2218-841X)Vol.7, No.2, pp 9-16,2010. (Printed copy: Islamic Uni. Kushtia, Journal)",
        "url": ""
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter , Combined effects of radiation and heat generation on MHD natural convection flow along a vertical flat plate in presence of heat conduction, BRAC University Journal Vol. VI, No.2, pp.11-20, 2009. http://hdl.handle.net/10361/459",
        "url": "http://hdl.handle.net/10361/459"
      },
      {
        "title": "Mohammad Mokaddes Ali, Rowsanara Akhter , NHM. A. Azim, The effects of radiation and joule heating on MHD natural convection flow along a vertical flat plate in presence of heat conduction, Southeast University Journal of Science and Engineering, Vol.4, No. 4, December 2009. (Printed copy: Southeast University Journal)",
        "url": ""
      },
      {
        "title": "Rowsanara Akhter, Mohammad Mokaddes Ali, M. A. Maleque and A. A. Mamun, The effect of combined radiation and conduction on MHD natural convection flow along a vertical flat plate, 16TH Math. conf. of Bangladesh Mathematical Society, December, 2009.",
        "url": ""
      },
      {
        "title": "Rowsanara Akhter, M. M Ali and M. A. Maleque, The effects radiation and viscous dissipation on MHD natural convection flow along a vertical flat plate in presence of heat conduction, 16TH Math. conf. of Bangladesh Mathematical Society, December, 2009.",
        "url": ""
      },
      {
        "title": "Combined effect of radiation and conduction on MHD natural convection flow along a vertical flat plate",
        "url": ""
      },
      {
        "title": "Effects of Thermal Radiation and Pressure Work on Viscous Joule Heating MHDConjugate Heat Transfer with Variable Viscosity and Thermal Conductivity in Presence of Heat Generation.",
        "url": ""
      }
    ]
  },
  {
    "serial": 4,
    "slug": "reduanul-bari-shovon",
    "cleanSlug": "reduanul-bari-shovon",
    "code": "RBS",
    "name": "Reduanul Bari Shovon",
    "designation": "Assistant Professor",
    "department": "Department of Computer Science and Engineering",
    "phone": "01680-359782",
    "email": "reduanul.bari@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/reduanul-bari-shovon",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628530/ius_faculty/hjstqpe1ji7fkcat04w4.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "MSc",
        "institute": "Jahangirnagar University",
        "year": "2020"
      },
      {
        "degree": "BSc",
        "institute": "North South University",
        "year": "2018"
      },
      {
        "degree": "HSC",
        "institute": "Savar Cantonment Public School and College",
        "year": "2012"
      },
      {
        "degree": "SSC",
        "institute": "Savar Cantonment Public School and College",
        "year": "2010"
      }
    ],
    "experience": [
      {
        "role": "Senior Lecturer",
        "company": "University of Scholars (IUS)",
        "duration": "01/06/2024 - Present"
      },
      {
        "role": "Lecturer",
        "company": "University of Scholars (IUS)",
        "duration": "5/04/2021 - 31/05/2024"
      },
      {
        "role": "Lecturer",
        "company": "University of Global Village (UGV)",
        "duration": "01/02/2020 - 30/11/2021"
      },
      {
        "role": "Executive",
        "company": "Service Engine Limited",
        "duration": "1/11/2019 - 30/11/2019"
      }
    ],
    "publications": [
      {
        "title": "Iot Based Real Time Environment Monitoring and Forecasting System incorporation with Air Pollution Detector based on Na&iuml;ve Bayes Algorithm.",
        "url": ""
      },
      {
        "title": "Real Time Face Detection, Recognition and Verification Technology By Thesis Enhancing the Security of ATM Booth Using Raspberry Pi, Webcam Module and Image Processing with OpenCV Library.",
        "url": ""
      },
      {
        "title": "Training on Foundations of User Experience (UX) Design from Coursera",
        "url": ""
      },
      {
        "title": "Training on Mobile Application Development (Topics are covered on Object Oriented Programming Java, ID Application, Intent, Vector Asset, Fragment, Customization, Widget, Backend As a Service) from Udemy, 3 months in 2021",
        "url": ""
      },
      {
        "title": "Training on Practical Web Development from Udemy",
        "url": ""
      },
      {
        "title": "Served as Library Editor at Prothom Alo Bandhushova for 2010/2012",
        "url": ""
      },
      {
        "title": "Organized Departmental Annual Picnic of 2022",
        "url": ""
      },
      {
        "title": "Participated as a member Bangladesh National Cadet Corporation",
        "url": ""
      },
      {
        "title": "Served as a member of NSU Earth Club.",
        "url": ""
      }
    ]
  },
  {
    "serial": 5,
    "slug": "a-k-m-monzurul-islam",
    "cleanSlug": "a-k-m-monzurul-islam",
    "code": "MMI",
    "name": "A K M Monzurul Islam",
    "designation": "Assistant Professor",
    "department": "Department of Computer Science and Engineering",
    "phone": "01717-558760",
    "email": "mislam@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/a-k-m-monzurul-islam",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628532/ius_faculty/ysqgjkuhxorydsubgtv3.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "MBA in MIS",
        "institute": "World University of Bangladesh",
        "year": "2009"
      },
      {
        "degree": "M.Sc in CSE",
        "institute": "Bangalore University",
        "year": "2002"
      },
      {
        "degree": "B.Sc in CSE",
        "institute": "Bangalore University",
        "year": "2000"
      },
      {
        "degree": "HSC",
        "institute": "Khulna Public College",
        "year": "1995"
      },
      {
        "degree": "SSC",
        "institute": "Khulna Public College",
        "year": "1993"
      }
    ],
    "experience": [
      {
        "role": "Assistant Professor and Head of Department (Natural Science)",
        "company": "University of Scholars (IUS)",
        "duration": "September 2020 to Date"
      },
      {
        "role": "Adjunct Faculty (CSE Department)",
        "company": "Independent University Bangladesh (IUB)",
        "duration": "September 2016 to Date"
      },
      {
        "role": "Manager",
        "company": "Europa Group",
        "duration": "January 2015 to August 2017."
      },
      {
        "role": "Senior IT Executive",
        "company": "MGH Group",
        "duration": "January 2010 to December 2014."
      },
      {
        "role": "Lecturer",
        "company": "Atish Dipankar University of Science &amp; Technology",
        "duration": "September 2005 to December 2009"
      },
      {
        "role": "Lecturer",
        "company": "World University of Bangladesh",
        "duration": "April 2004 to August 2005"
      },
      {
        "role": "Instructor",
        "company": "Gateway Education",
        "duration": "February 2003 to March 2004"
      }
    ],
    "publications": [
      {
        "title": "A.K.M. Monzurul Islam &amp; Mustafa Nizamul Aziz (2020). An example of developing a knowledge-based system. International Journal of Science and Business, 4(7), 52-56. DOI:",
        "url": "https://zenodo.org/record/3908998#.YyFxknZByUk"
      },
      {
        "title": "Mustafa Nizamul Aziz &amp; A.K.M. Monzurul Islam (2020). Reviewing Data Mining as an enabling technology for BI. International Journal of Science and Business, 4(7), 46-51. DOI:",
        "url": "https://doi.org/10.5281/zenodo.3908987"
      },
      {
        "title": "Completed 40+ Online certificates with good scores from renowned foreign Universities like the University of California San Diego, the University of Michigan, Macquarie University, Johns Hopkins University, the University of Colorado Boulder, and more.",
        "url": ""
      },
      {
        "title": "Completed Diploma certificate course on \"Hardware Technology\" from Bangalore Institute of Information Technology (BIIT).",
        "url": ""
      },
      {
        "title": "Completed Training for Professional Development on Quality Assurance and Accreditation in Higher Education from Bangladesh Accreditation Council (BAC)",
        "url": ""
      }
    ]
  },
  {
    "serial": 6,
    "slug": "dr.-md-shaiful-islam",
    "cleanSlug": "dr-md-shaiful-islam",
    "code": "SI",
    "name": "Dr. Md Shaiful Islam",
    "designation": "Assistant Professor",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/dr.-md-shaiful-islam",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798723/ius_faculty/dr_md_shaiful_islam.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "Post-Doctoral Fellow- Department of Mechatronics",
        "institute": "International Islamic University Malaysia (IIUM), Malaysia",
        "year": "International Islamic University Malaysia (IIUM), Malaysia"
      },
      {
        "degree": "PhD in Tun Razak Graduate School of Business",
        "institute": "Universiti Tun Abdul Razak (UNIRAZAK), Malaysia",
        "year": "2024"
      },
      {
        "degree": "Master of Science in Computer Science",
        "institute": "American International University, Bangladesh",
        "year": "2012"
      },
      {
        "degree": "Bachelor of Science in Computer Science",
        "institute": "University of Madras, India",
        "year": "2004"
      },
      {
        "degree": "Higher Secondary Certificate (H.S.C) in Science",
        "institute": "Islamic University Technical College, Dhaka, Bangladesh",
        "year": "1999"
      },
      {
        "degree": "Secondary School Certificate (S.S.C) in Science",
        "institute": "Bindubashini Government Boys School, Dhaka, Bangladesh",
        "year": "1997"
      }
    ],
    "experience": [
      {
        "role": "Assistant Professor",
        "company": "University of Scholars",
        "duration": "September 2025 - Present"
      },
      {
        "role": "Founder &amp; CEO",
        "company": "4beats Limited &ndash; Dhaka",
        "duration": "May 2016 &ndash; Present"
      },
      {
        "role": "Founder &amp; CEO",
        "company": "Online News Portal 24 &ndash; Dhaka",
        "duration": "Mar 2020 &ndash; Present"
      },
      {
        "role": "Senior Project Manager",
        "company": "Nexgen Technologies Sdn Bhd-Kuala Lumpur",
        "duration": "Mar 2024 &ndash; Feb 2025"
      },
      {
        "role": "Chief Executive Officer (Remote)",
        "company": "QUPS (Quality Up Services) &ndash; Dhaka",
        "duration": "Feb 2024 &ndash; Jan 2025"
      },
      {
        "role": "Founder &amp; CEO",
        "company": "Gramen Ponno &ndash; Dhaka",
        "duration": "June 2018 &ndash; June 2024"
      },
      {
        "role": "QA Manager / Test Manager",
        "company": "Tasawr Interactive &ndash; Dhaka",
        "duration": "Mar 2009 &ndash; Nov 2010"
      },
      {
        "role": "Assistant Manager / Test Leader",
        "company": "Bangladesh Internet Press Ltd. (BIPL) &ndash; Dhaka",
        "duration": "Mar 2007 &ndash; Feb 2009"
      },
      {
        "role": "Test Engineer",
        "company": "UNIQA BDC. - Dhaka",
        "duration": "Dec 2005 &ndash; Sept 2006"
      },
      {
        "role": "SQA Engineer / Test Engineer",
        "company": "DataSoft Systems Bangladesh Ltd. - Dhaka",
        "duration": "Jan 2005 &ndash; Nov 2005"
      }
    ],
    "publications": [
      {
        "title": "Shaiful Islam; Bishwajit B. Pathik; Manzur H. Khan; Mamun Habib, &ldquo;Software Test Estimation Tool: Comparable with COCOMOII Model&rdquo;, The IEEE International Conference on Industrial Engineering and Engineering Management, 4-7 December 2016, Indonesia",
        "url": ""
      },
      {
        "title": "Shaiful Islam; Bishwajit B. Pathik; Manzur H. Khan; Mamun Habib, &ldquo;A Novel Tool for Reducing Time and Cost at Software Test Estimation: An Use Cases and Functions Based Approach&rdquo;, The IEEE International Conference on Industrial Engineering and Engineering Management, 9-12 December 2014, Malaysia",
        "url": ""
      },
      {
        "title": "Shaiful Islam; Bishwajit B. Pathik; Manzur H. Khan; Mamun Habib, &ldquo;Software Test Estimation Tools using Use Cases and Functions&rdquo;, The IEEE International Conference on Industrial Engineering and Engineering Management, 10-13 December 2013 Bangkok, Thailand",
        "url": ""
      },
      {
        "title": "Shaiful Islam, &ldquo;Preparing Bangladeshi Computer Science Students for the Industry: Bridging Academia and Real-World Demands&rdquo;, East West University, 23 August 2025",
        "url": ""
      },
      {
        "title": "Shaiful Islam, &ldquo;Bridging the Academy&ndash;Industry Gap in Bangladesh&rsquo;s Software Industry&rdquo;, CSE FEST, Daffodil International University, University Auditorium, 8 December 2021",
        "url": ""
      },
      {
        "title": "Shaiful Islam, &ldquo;SLC Process for Software Development &amp; Quality Control&rdquo;, Day-Long Workshop, Key Speaker, Mawlana Bhashani Science and Technology University, 2012",
        "url": ""
      },
      {
        "title": "Shaiful Islam, &ldquo;Software Quality Assurance &amp; Testing&rdquo;, Day-Long Seminar, Day-Long Workshop, Speaker, Daffodil International University, 2019",
        "url": ""
      },
      {
        "title": "Shaiful Islam, &ldquo;Automated Software Testing&rdquo;, Day-Long Workshop, Trainer, DataSoft Systems Bangladesh Ltd., 2012",
        "url": ""
      },
      {
        "title": "Shaiful Islam, &ldquo;Software Testing, Quality Control &amp; Assurance&rdquo;, Day-Long Seminar, Key Speaker, United International University (UIU), 2005",
        "url": ""
      },
      {
        "title": "Well-versed with the following Tools: o Data Analysis Tools: IBM SPSS, IBM AMOS, Smart PLS o Test Automation Tools: Java Selenium, Watir, UFP o CI/CD and DevOps Integration: Jenkins X o Performance Testing Tools: JMeter, LoadRunner o Test Management Tools: JIRA, TestTrack Pro, Workbench, Mantis, Test Director o Mobile Testing Tools: Appium",
        "url": ""
      },
      {
        "title": "Domain Area: o Mobile, Wearable, TV, IoT, RB5 Robotics, FHUB, RPi4 o Hospital ERP, Accounting, MIS, Finance System",
        "url": ""
      },
      {
        "title": "PMI Membership: 5559741",
        "url": ""
      },
      {
        "title": "IEEE Membership: 97404656",
        "url": ""
      },
      {
        "title": "Google Scholar: https://scholar.google.com/citations?user=CcUrYAEAAAAJ&amp;hl",
        "url": ""
      },
      {
        "title": "ResearchGate: https://www.researchgate.net/profile/Md_Islam1292",
        "url": ""
      },
      {
        "title": "ORCID: https://orcid.org/0000-0002-2705-7328",
        "url": "https://orcid.org/0000-0002-2705-7328"
      },
      {
        "title": "Academia: https://independent.academia. edu/MDSHAIFULISLAMD20302023",
        "url": "https://independent.academia.edu/MDSHAIFULISLAMD20302023"
      },
      {
        "title": "https://shaiful.info/",
        "url": ""
      },
      {
        "title": "https://www.linkedin.com/in/shaiful",
        "url": "https://www.linkedin.com/in/shaiful"
      },
      {
        "title": "Advanced AutoCAD AI Chatbot Development for Intelligent Design Role: Principal Investigator",
        "url": ""
      },
      {
        "title": "Current Status: Submitted for Fund",
        "url": ""
      },
      {
        "title": "Fund Provider: Ministry Of Education (BANBEIS) (GARE)",
        "url": ""
      },
      {
        "title": "Experimental Investigation of CNC Milling Parameters for Wooden Furniture Production with an Indigenous Machine Prototype Role: Project Manager",
        "url": ""
      },
      {
        "title": "Current Status: Submitted for Fund",
        "url": ""
      },
      {
        "title": "Fund Provider: Ministry Of Education (BANBEIS) (GARE)",
        "url": ""
      },
      {
        "title": "Mechanics and Performance Analysis of Micro-Tunnel Boring in Varied Geotechnical Conditions Available in Bangladesh Role: Project Manager",
        "url": ""
      },
      {
        "title": "Current Status: Submitted for Fund",
        "url": ""
      },
      {
        "title": "Fund Provider: Ministry Of Education (BANBEIS) (GARE)",
        "url": ""
      }
    ]
  },
  {
    "serial": 7,
    "slug": "m.m.-fazle-rabbi",
    "cleanSlug": "mm-fazle-rabbi",
    "code": "MMFR",
    "name": "M.M. Fazle Rabbi",
    "designation": "Assistant Professor",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/m.m.-fazle-rabbi",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798727/ius_faculty/mm_fazle_rabbi.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "MSc in Computer Science",
        "institute": "University of Bedfordshire, Luton, Beds, UK",
        "year": "2010-2011"
      },
      {
        "degree": "Bachelor of Science (Honors) in Computer Information Systems (CIS)",
        "institute": "University of Windsor, Windsor, Ontario, Canada",
        "year": "2000-2004"
      },
      {
        "degree": "HSC",
        "institute": "Dhaka Board",
        "year": "1997"
      },
      {
        "degree": "SSC",
        "institute": "Dhaka Board",
        "year": "1995"
      }
    ],
    "experience": [
      {
        "role": "Assistant Professor",
        "company": "University of Scholars (IUS)",
        "duration": "October 2024&ndash;Present"
      },
      {
        "role": "Assistant Professor",
        "company": "Bangladesh University of Business &amp; Technology (BUBT)",
        "duration": "Oct 2018&ndash; Present"
      },
      {
        "role": "Lecturer",
        "company": "Bangladesh University of Business &amp; Technology (BUBT)",
        "duration": "July 2013&ndash;Oct 2018"
      },
      {
        "role": "Consultant",
        "company": "Harvest International School, Dhaka",
        "duration": "Jun 2024-Jun 2025"
      }
    ],
    "publications": [
      {
        "title": "ITEE FE Trainer, Information Technology Engineers Examination, JICA -BCC ITEE Project",
        "url": ""
      },
      {
        "title": "Title: Intensive Training Program on Applied Research Methodology (ITPARM) BUBT Research Centre, Mirpur, Dhaka",
        "url": ""
      },
      {
        "title": "Title: Personal Effectiveness Material: 7 Habits of Highly Effective People, FranklinCovey Training Institute: Pinnacle, Dhaka, Bangladesh",
        "url": ""
      }
    ]
  },
  {
    "serial": 8,
    "slug": "md.-ashif-mahmud-joy",
    "cleanSlug": "md-ashif-mahmud-joy",
    "code": "AMJ",
    "name": "Md. Ashif Mahmud Joy",
    "designation": "Assistant Professor",
    "department": "Department of Computer Science and Engineering",
    "phone": "01795-772575",
    "email": "ashif.joy@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/md.-ashif-mahmud-joy",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628538/ius_faculty/q2zmlxjnbjsslgazpxri.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "BSc",
        "institute": "United International University",
        "year": "2022"
      },
      {
        "degree": "HSC",
        "institute": "Dhaka College",
        "year": "2016"
      },
      {
        "degree": "SSC",
        "institute": "Engineering University School and College",
        "year": "2014"
      }
    ],
    "experience": [
      {
        "role": "Senior Lecturer",
        "company": "International University of Scholars",
        "duration": "June 2024 - Present"
      },
      {
        "role": "Lecturer",
        "company": "International University of Scholars",
        "duration": "May 2022 - May 2024"
      },
      {
        "role": "Reactjs Developer",
        "company": "Shuffle BV(Amsterdam)",
        "duration": "2022 (2 Months)"
      },
      {
        "role": "Social Media Manager",
        "company": "Adios BD",
        "duration": "2021 (5 Months)"
      }
    ],
    "publications": [
      {
        "title": "Python for everybody - from Udemy",
        "url": ""
      },
      {
        "title": "Development with Django - from Udemy",
        "url": ""
      },
      {
        "title": "Javascript 20 projects - from Udemy",
        "url": ""
      },
      {
        "title": "Reactjs for beginners - from Udemy",
        "url": ""
      },
      {
        "title": "Graphics designing advanced - from Udemy",
        "url": ""
      },
      {
        "title": "Full stack web development - from Programming Hero",
        "url": ""
      },
      {
        "title": "Machine Learning with CNN - from Udemy",
        "url": ""
      },
      {
        "title": "SQA Management - from Lynda",
        "url": ""
      }
    ]
  },
  {
    "serial": 9,
    "slug": "md.-nurul-islam",
    "cleanSlug": "md-nurul-islam",
    "code": "MNI",
    "name": "Md. Nurul Islam",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "01521-470560",
    "email": "nisakib@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/md.-nurul-islam",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628535/ius_faculty/k1aqgkd9gtelsvajrvgk.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 10,
    "slug": "sm-moniruzzaman",
    "cleanSlug": "sm-moniruzzaman",
    "code": "SMM",
    "name": "SM Moniruzzaman",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "01717-604625",
    "email": "moniruzzaman70@gmail.com",
    "profileUrl": "https://ius.edu.bd/profile/sm-moniruzzaman",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628541/ius_faculty/tj26ymsn1xcvgbeap7ze.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 11,
    "slug": "abu-sufian-md.-shahed",
    "cleanSlug": "abu-sufian-md-shahed",
    "code": "ASMS",
    "name": "Abu Sufian Md. Shahed",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "01817-077953",
    "email": "enggshahedsir@gmail.com",
    "profileUrl": "https://ius.edu.bd/profile/abu-sufian-md.-shahed",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628543/ius_faculty/a85c562ulfmccojuyoyz.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 12,
    "slug": "arpita-roy",
    "cleanSlug": "arpita-roy",
    "code": "AR",
    "name": "Arpita Roy",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "01957-9738598",
    "email": "arpitaroy@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/arpita-roy",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628545/ius_faculty/b4i33ppnq2odnsdq5azb.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 13,
    "slug": "md.-israfil-islam",
    "cleanSlug": "md-israfil-islam",
    "code": "MII",
    "name": "Md. Israfil Islam",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/md.-israfil-islam",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798731/ius_faculty/md_israfil_islam.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 14,
    "slug": "mahbub-e-sobhani",
    "cleanSlug": "mahbub-e-sobhani",
    "code": "MES",
    "name": "Mahbub-E-Sobhani",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "01521-333309",
    "email": "mahbub@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/mahbub-e-sobhani",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628547/ius_faculty/rx7cjgzsdcberca6nyha.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "M.Sc",
        "institute": "United International University",
        "year": "Ongoing"
      },
      {
        "degree": "B.Sc",
        "institute": "United International University",
        "year": "2021"
      },
      {
        "degree": "HSC",
        "institute": "Dhaka Residential Model College",
        "year": "2015"
      },
      {
        "degree": "SSC",
        "institute": "Monipur High School",
        "year": "2013"
      }
    ],
    "experience": [
      {
        "role": "1",
        "company": "State University of Bangladesh",
        "duration": "Research Assistant (Part Time)"
      },
      {
        "role": "2",
        "company": "Orange Solutions Limited, United Group",
        "duration": "Junior Software Engineer"
      },
      {
        "role": "3",
        "company": "Bangladesh-Japan ICT Engineers' Training Program",
        "duration": "Trainee"
      },
      {
        "role": "4",
        "company": "SoftBD Limited",
        "duration": "Software Engineer Intern"
      },
      {
        "role": "5",
        "company": "Fronture Technologies Limited",
        "duration": "Software Engineer Intern"
      }
    ],
    "publications": [
      {
        "title": "Advancing Bangla Punctuation Restoration by a Monolingual Transformer-Based Method and a Large-Scale Corpus. Details: https://aclanthology.org/2023.banglalp-1.3/",
        "url": "https://aclanthology.org/2023.banglalp-1.3/"
      },
      {
        "title": "Bangla Social Media Cyberbullying Detection Using Deep Learning. Details: https://link.springer.com/chapter/10.1007/978-981-99-7649-2_13",
        "url": "https://link.springer.com/chapter/10.1007/978-981-99-7649-2_13"
      },
      {
        "title": "An Enhanced Text Compression Approach Using Transformer-based Language Models.",
        "url": ""
      },
      {
        "title": "Imbalanced Intrusion Classification using Ensemble Learning with Informative Instances",
        "url": ""
      },
      {
        "title": "Advancing Medication Safety Through Aspect Extraction and ADR Detection.",
        "url": ""
      }
    ]
  },
  {
    "serial": 15,
    "slug": "israt-jahan",
    "cleanSlug": "israt-jahan",
    "code": "IJ",
    "name": "Israt Jahan",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/israt-jahan",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798736/ius_faculty/israt_jahan.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 16,
    "slug": "sadia-nur-nazifa",
    "cleanSlug": "sadia-nur-nazifa",
    "code": "SNN",
    "name": "Sadia Nur Nazifa",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "01632-321368",
    "email": "sadianurnazifa@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/sadia-nur-nazifa",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628550/ius_faculty/ewcse925m507voiku0yc.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "H.S.C.",
        "institute": "Holy Cross College",
        "year": "2019"
      },
      {
        "degree": "S.S.C.",
        "institute": "Mohammadpur Preparatory School and College",
        "year": "2017"
      }
    ],
    "experience": [
      {
        "role": "1",
        "company": "University of Scholars",
        "duration": "Lecturer (Dept of CSE)"
      },
      {
        "role": "2",
        "company": "BrainStation 23",
        "duration": "Intern"
      }
    ],
    "publications": [
      {
        "title": "PPDHero: Requirements Elicitation and Development of a System to Empower New Mothers on Postpartum Depression. Link: https://doi.org/10.1007/978-3-031-64850-2_37",
        "url": "https://doi.org/10.1007/978-3-031-64850-2_37"
      },
      {
        "title": "MBLDP-R: A Multiple Biomolecules Based Rapid Life Detection Protocol Embedded in a Rover Scientific Subsystem for Soil Sample Analysis Link: https://dx.doi.org/10.21203/rs.3.rs-1263964/v1",
        "url": "https://dx.doi.org/10.21203/rs.3.rs-1263964/v1"
      },
      {
        "title": "Workshop on AutoML organized by IDARE",
        "url": ""
      },
      {
        "title": "Workshop on Fundamental IT Engineer Examination of Information Technology Engineers Examination (ITEE) conducted by BD-ITEC &amp; BCC at MIST",
        "url": ""
      },
      {
        "title": "Led the Science Subteam, ensuring the seamless integration of science modules into robotics projects.",
        "url": ""
      },
      {
        "title": "Provided technical guidance to team members and conducted qualitative and quantitative research on biomolecules using AI and ML.",
        "url": ""
      },
      {
        "title": "Collaborated with the Mechanical Subteam to align science modules with project requirements and mentored team members in science-related aspects.",
        "url": ""
      },
      {
        "title": "Organized NCPC (National Collegiate Programming Contest) 2020 at MIST",
        "url": ""
      },
      {
        "title": "Artificial Intelligence",
        "url": ""
      },
      {
        "title": "Machine Learning",
        "url": ""
      },
      {
        "title": "Data Science",
        "url": ""
      },
      {
        "title": "Digital Image Processing",
        "url": ""
      },
      {
        "title": "Computer Vision",
        "url": ""
      },
      {
        "title": "Human-Computer Interaction",
        "url": ""
      },
      {
        "title": "CyberSecurity",
        "url": ""
      },
      {
        "title": "Internet of Things",
        "url": ""
      }
    ]
  },
  {
    "serial": 17,
    "slug": "sabikun-nahar-zerin",
    "cleanSlug": "sabikun-nahar-zerin",
    "code": "SNZ",
    "name": "Sabikun Nahar Zerin",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/sabikun-nahar-zerin",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628552/ius_faculty/xiokcjf3z0macoggxbwz.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 18,
    "slug": "syada-tasfia-rahman",
    "cleanSlug": "syada-tasfia-rahman",
    "code": "ST",
    "name": "Syada Tasfia Rahman",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/syada-tasfia-rahman",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798741/ius_faculty/syada_tasfia_rahman.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 19,
    "slug": "asib-mostakim-fony",
    "cleanSlug": "asib-mostakim-fony",
    "code": "AMF",
    "name": "Asib Mostakim Fony",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "01521-487370",
    "email": "asibmostakim@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/asib-mostakim-fony",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628555/ius_faculty/hsolicbdz0dvioytude4.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "M.S.",
        "institute": "University of Chittagong",
        "year": "2019"
      },
      {
        "degree": "B.Sc.",
        "institute": "University of Chittagong",
        "year": "2018"
      },
      {
        "degree": "HSC",
        "institute": "Govt. Hazi Muhammad Mohsin College",
        "year": "2013"
      },
      {
        "degree": "SSC",
        "institute": "Govt. Muslim High School",
        "year": "2011"
      }
    ],
    "experience": [
      {
        "role": "Lecturer",
        "company": "University of Scholars",
        "duration": "2023- present"
      },
      {
        "role": "Jr. Software Engineer",
        "company": "General Software Solutions",
        "duration": "March, 2023- May, 2023"
      }
    ],
    "publications": [
      {
        "title": "Hasan, S., Fony, A.M. and Uddin, M.M., 2019, February. Reduced model based feedback stabilization of large-scale sparse power system model. In 2019 International Conference on Electrical, Computer and Communication Engineering (ECCE) (pp. 1-6). IEEE.",
        "url": ""
      },
      {
        "title": "Du, X., Iqbal, K.I.B., Uddin, M.M., Fony, A.M., Hossain, M.T., Ahmad, M.I. and Hossain, M.S., 2021. Computational techniques for H2 optimal frequency-limited model order reduction of large-scale sparse linear systems. Journal of Computational Science , 55 , p.101473.",
        "url": "https://www.sciencedirect.com/topics/computer-science/matrix-equation"
      },
      {
        "title": "Du, X., Uddiny, M.M., Fonyz, A.M., Hossainx, M.T. and Shuzan, M.N.I., 2021. Iterative Rational Krylov Algorithms for model reduction of a class of constrained structural dynamic system with Engineering applications. arXiv preprint arXiv:2101.03053 .",
        "url": ""
      },
      {
        "title": "Training on Enterprise System Analysis and Design using C-Sharp conducted lsdb-BISEW scholarship program for 1 year.",
        "url": ""
      }
    ]
  },
  {
    "serial": 20,
    "slug": "h-m-ikram-kays",
    "cleanSlug": "h-m-ikram-kays",
    "code": "HMK",
    "name": "H M Ikram Kays",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/h-m-ikram-kays",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798745/ius_faculty/h_m_ikram_kays.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 21,
    "slug": "tuhin-hossain",
    "cleanSlug": "tuhin-hossain",
    "code": "TH",
    "name": "Tuhin Hossain",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "01567-942861",
    "email": "tuhin@ius.edu.bd",
    "profileUrl": "https://ius.edu.bd/profile/tuhin-hossain",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628557/ius_faculty/cnmpo1bwnyjms69yysrp.jpg",
    "officeAddress": "",
    "bio": "",
    "researchInterests": [],
    "education": [
      {
        "degree": "MSc",
        "institute": "Jahangirnagar University",
        "year": "2022"
      },
      {
        "degree": "BSc",
        "institute": "Daffodil International University",
        "year": "2021"
      },
      {
        "degree": "HSC",
        "institute": "Hajigonj Model Govt. College",
        "year": "2015"
      },
      {
        "degree": "SSC",
        "institute": "Firojpur J. K High School",
        "year": "2013"
      }
    ],
    "experience": [
      {
        "role": "Lecturer",
        "company": "University of Scholars (IUS)",
        "duration": "18/05/2023 - Present"
      },
      {
        "role": "Network Engineer",
        "company": "Icon Infotech Limited",
        "duration": "08/06/2021 - 31/12/2021"
      },
      {
        "role": "Teaching Assistant",
        "company": "Daffodil International University",
        "duration": "1/10/2020 - 30/04/2021"
      }
    ],
    "publications": [
      {
        "title": "Hossain, T., Kabir, A. A. N., Ratul, M. A. H., &amp; Sattar, A. (2022, March). Sentence Level Sentiment Classification Using Machine Learning Approach in the Bengali Language. In 2022 International Conference on Decision Aid Sciences and Applications (DASA) (pp. 1286-1289). IEEE.",
        "url": ""
      },
      {
        "title": "Cisco Certified Network Associate (CCNA) from Bangladesh University of Engineering and Technology (BUET)",
        "url": ""
      },
      {
        "title": "Web Design &amp; Development from Dusra Soft Ltd",
        "url": ""
      },
      {
        "title": "Online conference award certificate : Decision Aid Sciences and Application (DASA), International Conference ,",
        "url": ""
      },
      {
        "title": "Procedure of Preparing &amp; Presenting a Research Paper,",
        "url": ""
      },
      {
        "title": "Improving Writing Skills with Better Impact,",
        "url": ""
      }
    ]
  },
  {
    "serial": 22,
    "slug": "md.-rahad-islam-bhuiyan",
    "cleanSlug": "md-rahad-islam-bhuiyan",
    "code": "MRIB",
    "name": "Md. Rahad Islam Bhuiyan",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/md.-rahad-islam-bhuiyan",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798749/ius_faculty/md_rahad_islam_bhuiyan.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 23,
    "slug": "tahmid-ahmod",
    "cleanSlug": "tahmid-ahmod",
    "code": "TA",
    "name": "Tahmid Ahmod",
    "designation": "Lecturer",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/tahmid-ahmod",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798755/ius_faculty/tahmid_ahmod.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 24,
    "slug": "wasimul-karim",
    "cleanSlug": "wasimul-karim",
    "code": "WK",
    "name": "Wasimul Karim",
    "designation": "Research Assistant",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/wasimul-karim",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798372/ius_faculty/wasimul_karim.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 25,
    "slug": "shah-samiur-rahman",
    "cleanSlug": "shah-samiur-rahman",
    "code": "SSR",
    "name": "Shah Samiur Rahman",
    "designation": "Research Intern",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/shah-samiur-rahman",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798759/ius_faculty/shah_samiur_rahman.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 26,
    "slug": "robiul-alam-romjan",
    "cleanSlug": "robiul-alam-romjan",
    "code": "RAR",
    "name": "Robiul Alam Romjan",
    "designation": "Teaching Assistant",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/robiul-alam-romjan",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798763/ius_faculty/robiul_alam_romjan.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  },
  {
    "serial": 27,
    "slug": "mamunur-rashid-shihab",
    "cleanSlug": "mamunur-rashid-shihab",
    "code": "MRS",
    "name": "Mamunur Rashid Shihab",
    "designation": "Lab Assistant",
    "department": "Department of Computer Science and Engineering",
    "phone": "",
    "email": "",
    "profileUrl": "https://ius.edu.bd/profile/mamunur-rashid-shihab",
    "imageUrl": "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798768/ius_faculty/mamunur_rashid_shihab.jpg",
    "officeAddress": "Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka",
    "bio": "",
    "researchInterests": [],
    "education": [],
    "experience": [],
    "publications": []
  }
];

// Teacher code directory for routine schedules and fast lookup
export const TEACHER_DIRECTORY: Record<string, TeacherInfo> = {
  "MAA": {
    code: "MAA",
    name: "Engr. Md. Ahsan Arif",
    designation: "Associate Professor & Head of the Department",
    department: "Department of Computer Science and Engineering",
    phone: "01711-787147",
    email: "ahsan@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628522/ius_faculty/eylkudgmeithba6u79ql.png"
  },
  "MAR": {
    code: "MAR",
    name: "Mamoon Al Rasheed",
    designation: "Associate Professor & Director IQAC",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628524/ius_faculty/q2qac8smq02cyq6qvpok.jpg"
  },
  "DRA": {
    code: "DRA",
    name: "Dr. Rowsanara Akhter",
    designation: "Associate Professor",
    department: "Department of Computer Science and Engineering",
    phone: "01716-895607",
    email: "dr.rowsanara@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628528/ius_faculty/rlaipriombiydzc36tes.jpg"
  },
  "RBS": {
    code: "RBS",
    name: "Reduanul Bari Shovon",
    designation: "Assistant Professor",
    department: "Department of Computer Science and Engineering",
    phone: "01680-359782",
    email: "reduanul.bari@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628530/ius_faculty/hjstqpe1ji7fkcat04w4.jpg"
  },
  "MMI": {
    code: "MMI",
    name: "A K M Monzurul Islam",
    designation: "Assistant Professor",
    department: "Department of Computer Science and Engineering",
    phone: "01717-558760",
    email: "mislam@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628532/ius_faculty/ysqgjkuhxorydsubgtv3.jpg"
  },
  "SI": {
    code: "SI",
    name: "Dr. Md Shaiful Islam",
    designation: "Assistant Professor",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798723/ius_faculty/dr_md_shaiful_islam.jpg"
  },
  "MMFR": {
    code: "MMFR",
    name: "M.M. Fazle Rabbi",
    designation: "Assistant Professor",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798727/ius_faculty/mm_fazle_rabbi.jpg"
  },
  "AMJ": {
    code: "AMJ",
    name: "Md. Ashif Mahmud Joy",
    designation: "Assistant Professor",
    department: "Department of Computer Science and Engineering",
    phone: "01795-772575",
    email: "ashif.joy@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628538/ius_faculty/q2zmlxjnbjsslgazpxri.jpg"
  },
  "MNI": {
    code: "MNI",
    name: "Md. Nurul Islam",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "01521-470560",
    email: "nisakib@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628535/ius_faculty/k1aqgkd9gtelsvajrvgk.jpg"
  },
  "SMM": {
    code: "SMM",
    name: "SM Moniruzzaman",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "01717-604625",
    email: "moniruzzaman70@gmail.com",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628541/ius_faculty/tj26ymsn1xcvgbeap7ze.jpg"
  },
  "ASMS": {
    code: "ASMS",
    name: "Abu Sufian Md. Shahed",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "01817-077953",
    email: "enggshahedsir@gmail.com",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628543/ius_faculty/a85c562ulfmccojuyoyz.jpg"
  },
  "AR": {
    code: "AR",
    name: "Arpita Roy",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "01957-9738598",
    email: "arpitaroy@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628545/ius_faculty/b4i33ppnq2odnsdq5azb.jpg"
  },
  "MII": {
    code: "MII",
    name: "Md. Israfil Islam",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798731/ius_faculty/md_israfil_islam.jpg"
  },
  "MES": {
    code: "MES",
    name: "Mahbub-E-Sobhani",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "01521-333309",
    email: "mahbub@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628547/ius_faculty/rx7cjgzsdcberca6nyha.jpg"
  },
  "IJ": {
    code: "IJ",
    name: "Israt Jahan",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798736/ius_faculty/israt_jahan.jpg"
  },
  "SNN": {
    code: "SNN",
    name: "Sadia Nur Nazifa",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "01632-321368",
    email: "sadianurnazifa@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628550/ius_faculty/ewcse925m507voiku0yc.jpg"
  },
  "SNZ": {
    code: "SNZ",
    name: "Sabikun Nahar Zerin",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628552/ius_faculty/xiokcjf3z0macoggxbwz.jpg"
  },
  "ST": {
    code: "ST",
    name: "Syada Tasfia Rahman",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798741/ius_faculty/syada_tasfia_rahman.jpg"
  },
  "AMF": {
    code: "AMF",
    name: "Asib Mostakim Fony",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "01521-487370",
    email: "asibmostakim@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628555/ius_faculty/hsolicbdz0dvioytude4.jpg"
  },
  "HMK": {
    code: "HMK",
    name: "H M Ikram Kays",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798745/ius_faculty/h_m_ikram_kays.jpg"
  },
  "TH": {
    code: "TH",
    name: "Tuhin Hossain",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "01567-942861",
    email: "tuhin@ius.edu.bd",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628557/ius_faculty/cnmpo1bwnyjms69yysrp.jpg"
  },
  "MRIB": {
    code: "MRIB",
    name: "Md. Rahad Islam Bhuiyan",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798749/ius_faculty/md_rahad_islam_bhuiyan.jpg"
  },
  "TA": {
    code: "TA",
    name: "Tahmid Ahmod",
    designation: "Lecturer",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798755/ius_faculty/tahmid_ahmod.jpg"
  },
  "WK": {
    code: "WK",
    name: "Wasimul Karim",
    designation: "Research Assistant",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798372/ius_faculty/wasimul_karim.jpg"
  },
  "SSR": {
    code: "SSR",
    name: "Shah Samiur Rahman",
    designation: "Research Intern",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798759/ius_faculty/shah_samiur_rahman.jpg"
  },
  "RAR": {
    code: "RAR",
    name: "Robiul Alam Romjan",
    designation: "Teaching Assistant",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798763/ius_faculty/robiul_alam_romjan.jpg"
  },
  "MRS": {
    code: "MRS",
    name: "Mamunur Rashid Shihab",
    designation: "Lab Assistant",
    department: "Department of Computer Science and Engineering",
    phone: "",
    email: "",
    imageUrl: "https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798768/ius_faculty/mamunur_rashid_shihab.jpg"
  },
  "SSH": {
    code: "SSH",
    name: "Shaila Sharmin",
    designation: "Lecturer",
    department: "Department of CSE",
    phone: "01331-401708",
    email: "shaila.s@ius.edu.bd",
    imageUrl: ""
  },
  "SR": {
    code: "SR",
    name: "Sadman Rafi",
    designation: "Lecturer",
    department: "Department of CSE",
    phone: "01572-907774",
    email: "sadman@ius.edu.bd",
    imageUrl: ""
  },
  "SS": {
    code: "SS",
    name: "Samia Sabah",
    designation: "Lecturer",
    department: "Department of CSE",
    phone: "",
    email: "",
    imageUrl: ""
  },
  "DHS": {
    code: "DHS",
    name: "Dr. Hasan Sarwar",
    designation: "Professor",
    department: "Department of CSE",
    phone: "",
    email: "",
    imageUrl: ""
  },
  "AA": {
    code: "AA",
    name: "Arafat Azom",
    designation: "Lecturer",
    department: "Department of CSE",
    phone: "",
    email: "",
    imageUrl: ""
  },
  "TBA": {
    code: "TBA",
    name: "To Be Announced",
    designation: "Faculty Member",
    department: "Department of CSE",
    phone: "",
    email: "",
    imageUrl: ""
  },
  "EEE-F1": {
    code: "EEE-F1",
    name: "EEE Faculty 1",
    designation: "Guest Faculty",
    department: "Department of EEE",
    phone: "",
    email: "",
    imageUrl: ""
  },
  "EEE-F2": {
    code: "EEE-F2",
    name: "EEE Faculty 2",
    designation: "Guest Faculty",
    department: "Department of EEE",
    phone: "",
    email: "",
    imageUrl: ""
  },
};

/**
 * Smart slug resolver: matches by exact slug, clean slug (no dots),
 * teacher code (case-insensitive), or normalized name.
 */
export function getFacultyBySlug(slug: string): FacultyMember | undefined {
  if (!slug) return undefined;
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  const stripped = normalized.replace(/\./g, "").replace(/\s+/g, "-");

  return CSE_FACULTY_MEMBERS.find((f) => {
    const fSlug = f.slug.toLowerCase();
    const fCleanSlug = f.cleanSlug.toLowerCase();
    const fCode = f.code.toLowerCase();
    const fNameSlug = f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    return (
      fSlug === normalized ||
      fCleanSlug === stripped ||
      fSlug === stripped ||
      fCleanSlug === normalized ||
      fCode === normalized ||
      fCode === stripped ||
      fNameSlug === stripped ||
      fNameSlug === normalized
    );
  });
}

export function getAllFacultySlugs(): string[] {
  const slugs = new Set<string>();
  CSE_FACULTY_MEMBERS.forEach((f) => {
    slugs.add(f.slug);
    if (f.cleanSlug) slugs.add(f.cleanSlug);
    if (f.code) slugs.add(f.code.toLowerCase());
  });
  return Array.from(slugs);
}
