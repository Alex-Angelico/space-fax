# space-fax

## Contributors

Jordan Kidwell, Audrena Vacirca, Ricardo Barceras, Alex Angelico

---

## Description

A source for customizable daily sapce facts based on user-selected interests.

---

## Problem Domain

Space is interesting. But space is hard! Lots of people are looking for a quick, interesting place to access diverse and itneresting informaiton about space exploration. Space FaX offers newbies an accessible platform for daily space facts and photos, and for people who have a deeper interest in more techincal info, a basic capability to track ongoing and upcoming space activity. Space FaX also encourages repeat user visits by giving them a location to store a gallery of cool space images.

---

## Features

○ get a daily astronomy picture and space weather fact.  
○ search for space images from NASA  
○ store and manage my favorite space images in a gallery.  
○ modern and clean-looking website  
○ be able to search for info about upcoming rocket launches and add it to a schedule.  
○ use a unified search bar with appropriately labelled radio buttons to toggle between  
different kinds of search input.  
○ (Stretch) learn about recent meteors that have entered the Earth’s atmosphere.  
○ (Stretch) look up satellites and see their positional data projected on a 2D map

---

### Daily Summary

A welcome message paired with a fact and image from the solar system.

---

### Satellite/Launch Tracker

Overview of positional and geographic data for orbiting satellites and upcoming space launches.

---

### Persistent Image Gallery

Location where users can store and review their favorite space images in a pleasing format.

---

### Simulated Login

Username data in local storage to simulate account access (possibly encoded with base64).

---

### Database Entity Relationship Diagram

Database Name: space_fax_data

Tables
fav_images
launch_schedule

fav_images 
Purpose
This table holds information about favorite images that users have looked up and saved in a gallery.

Columns
id (PRIMARY KEY)
img_url (VARCHAR (255))
description (TEXT)

Relationships
None

launch_schedule
Purpose
This table holds information about rocket launches that users have looked up and saved in a schedule.

Columns
id (PRIMARY KEY)
launch_provider (TEXT)
date (VARCHAR (255))
Description (TEXT)

Relationships
None

---

### **Software**

**Vision**  
Space FaX is designed to give a daily factoid and space image on the home page and allow the user to search for images related to a search query, using various NASA APIs. This search function will allow the user to view a variety of images from the same source. There will be a section dedicated to upcoming launches, so the user can view.  When humans explore, this triggers curiosity. This then raises questions – what, why, how etc. These questions then lead to discoveries. Curiosity inspires, discovery reveals.

#### **Scope (In/Out)**
**IN** - Pull data from various NASA APIs
- get a daily astronomy picture and space weather fact.
- search for space images from NASA
- store and manage my favorite space images in a gallery.
- modern and clean-looking website
- be able to search for info about upcoming rocket launches and add it to a schedule.
- use a unified search bar with appropriately labelled radio buttons to toggle between different kinds of search input.
- *(Stretch) learn about recent meteors that have entered the Earth’s atmosphere.*
- *(Stretch) look up satellites and see their positional data projected on a 2D map*

**OUT** - What will your product not do.
- The app will not 
- The app will not

### **Minimum Viable Product vs**

**What will your MVP functionality be?**

- Daily image and factoid on homepage, search for images, save images to a gallery, delete images from gallery and view a schedule of upcoming launches

**What are your stretch goals?**

- learn about recent meteors that have entered the Earth’s atmosphere, look up satellites and see their positional data projected on a 2D map
Stretch
What stretch goals are you going to aim for?
Aim for all

**Functional Requirements**

- A user can search for images from the NASA image gallery API.
- A user can search for rocket launches from the Launch Library API.
- A user can save to save images to a database table.
- A user can delete images from a database table.
- A user can save launch information to a database table.
- A user can delete launch information from a database table.

**Data Flow**
1. Homepage GET route makes automatic API call to APOD and DONKI for daily image and weather info content.
2. User searches launch schedule.
3. Launch search GET route makes API call to Launch Library for upcoming launches.
4. User adds interesting launches to launch_schedule database table with POST route.
5. User navigates to favorite launches.
6. Favorite launches GET route queries launch_schedule for data.
7. User can DELETE launches from favorites if they wish.
8. User searches for images.
9. Image search GET route makes API call to NASA Image Gallery for upcoming launches.
10. User adds interesting images to fav_images database table with POST route.
11. User navigates to favorite images.
12. Favorite images GET route queries fav_images for data.
13. User can DELETE images from favorites if they wish.

**Non-Functional Requirements**
1.   Usability: With our usability requirement, the goals of this website are going to be easy to accomplish quickly and with few errors. Our interface will be easy to learn and navigate. All buttons, headings and help/error messages are simple to understand for the user. The interface will appear easy to learn, rather than intimidating and demanding.
2.   Performance:  With this application, users will be able to click in real time to reveal facts/images onto a gallery page and with our *stretch goal* launch page, they will then be able to input information pertaining to a series of launches/database and be shown information accordingly. When searching for an image or facts, once information is loaded from the API onto the results page, users will be able to add to their gallery page to either view or remove into a DB. When The response times for the application loading, browser refresh and content being loaded should be smooth and efficient. The processing time for functions, routes, imports and exports of data should run smoothly as well, when set up properly within the application.

---

### **Domain Model**

![Domain Model](/readme/space-fax-domain-model.png)

---

### **Wireframes**

**Homepage:**  

![Homepage](/readme/wireframe1.png)

---

**Image Results:**  

![Image Results](/readme/wireframe2.png)

---

**Favorite Images:**  

![Favorite Images](/readme/wireframe3.png)

---

**Launch Schedule:**  

![Launch Schedule](/readme/wireframe4.png)

---

**favorite Launches:**  

![Favorite Launches](/readme/wireframe5.png)

---

### Technical Sources

[Date & Time Function:](https://www.plus2net.com/javascript_tutorial/clock.php)  