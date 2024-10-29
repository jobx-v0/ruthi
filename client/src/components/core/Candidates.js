import React from 'react';
import {  useState } from 'react';
import { Sidebar, SidebarBody,SidebarLink } from '../../ui/sidebar';
import { IconBriefcase, IconUser, IconPlus } from '@tabler/icons-react'; 

const Candidates = () => {
    // Get the authToken from the local storage
    const [open, setOpen] = useState(false);
    return (
        
        <div className="candidates-page" style={{ display: 'flex', height: '100vh' }}>
            <Sidebar open={open} setOpen={setOpen} className="flex-shrink-0">
            <SidebarBody className="flex flex-col justify-start py-9">
            <SidebarLink 
                link={{ href: '/jobcards', label: 'Job Cards', icon: <IconBriefcase /> }} 
                className="mb-2" // Add margin bottom for spacing
            />
            <SidebarLink 
                link={{ href: '/candidates', label: 'Candidates', icon: <IconUser /> }} 
            />
            <SidebarLink link={{ href: '/AddNewJob', label: 'Add New Job', icon:<IconPlus/>}}/>
            </SidebarBody>
          <div className="flex flex-col flex-1"></div>
          <div className="flex flex-col flex-1"></div>
            <div className="content" style={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px', // Optional padding
            }}>
                {/* Candidates content goes here */}
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>Candidates</h1>
                <p style={{ fontSize: '18px', color: '#4b5563' }}>Here are the candidates for the jobs</p>
            </div>
            </Sidebar>
        </div>
        
    );
};

export default Candidates;
