(function () {
    const measurementIcons = {
        advicescan: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_3911_139521)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 5C5.73478 5 5.48043 5.10536 5.29289 5.29289C5.10536 5.48043 5 5.73478 5 6V7C5 7.55228 4.55228 8 4 8C3.44772 8 3 7.55228 3 7V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H8C8.55228 3 9 3.44772 9 4C9 4.55228 8.55228 5 8 5H6ZM15 4C15 3.44772 15.4477 3 16 3H18C18.7956 3 19.5587 3.31607 20.1213 3.87868C20.6839 4.44129 21 5.20435 21 6V7C21 7.55228 20.5523 8 20 8C19.4477 8 19 7.55228 19 7V6C19 5.73478 18.8946 5.48043 18.7071 5.29289C18.5196 5.10536 18.2652 5 18 5H16C15.4477 5 15 4.55228 15 4ZM4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12ZM4 16C4.55228 16 5 16.4477 5 17V18C5 18.2652 5.10536 18.5196 5.29289 18.7071C5.48043 18.8946 5.73478 19 6 19H8C8.55228 19 9 19.4477 9 20C9 20.5523 8.55228 21 8 21H6C5.20435 21 4.44129 20.6839 3.87868 20.1213C3.31607 19.5587 3 18.7956 3 18V17C3 16.4477 3.44772 16 4 16ZM20 16C20.5523 16 21 16.4477 21 17V18C21 18.7957 20.6839 19.5587 20.1213 20.1213C19.5587 20.6839 18.7957 21 18 21H16C15.4477 21 15 20.5523 15 20C15 19.4477 15.4477 19 16 19H18C18.2652 19 18.5196 18.8946 18.7071 18.7071C18.8946 18.5196 19 18.2652 19 18V17C19 16.4477 19.4477 16 20 16Z" fill="currentColor"></path>
                        </g>
                        <defs>
                        <clipPath id="clip0_3911_139521">
                        <rect width="24" height="24" fill="currentColor"></rect>
                        </clipPath>
                        </defs>
                    </svg>`,
        solarpanels: `<svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.2003 3.53237C3.47642 2.66949 4.27854 2.08398 5.18451 2.08398H14.8347C15.7406 2.08398 16.5428 2.66949 16.8189 3.53237L19.0856 10.6157C19.5157 11.96 18.5128 13.334 17.1013 13.334H12.7179V14.584C13.6384 14.584 14.3846 15.3302 14.3846 16.2507C14.3846 17.1711 13.6384 17.9173 12.7179 17.9173H7.71793C6.79745 17.9173 6.05126 17.1711 6.05126 16.2507C6.05126 15.3302 6.79745 14.584 7.71793 14.584V13.334H2.91785C1.50639 13.334 0.503452 11.96 0.933629 10.6157L3.2003 3.53237ZM8.55126 13.334V15.0007C8.55126 15.2308 8.73781 15.4173 8.96793 15.4173H11.4679C11.698 15.4173 11.8846 15.2308 11.8846 15.0007V13.334H8.55126ZM7.78905 15.4173H7.71793C7.25769 15.4173 6.88459 15.7904 6.88459 16.2507C6.88459 16.7109 7.25769 17.084 7.71793 17.084H12.7179C13.1782 17.084 13.5513 16.7109 13.5513 16.2507C13.5513 15.7904 13.1782 15.4173 12.7179 15.4173H12.6468C12.4752 15.9028 12.0122 16.2507 11.4679 16.2507H8.96793C8.42367 16.2507 7.96065 15.9028 7.78905 15.4173ZM5.18451 2.91732C4.64093 2.91732 4.15965 3.26862 3.99398 3.78635L3.47207 5.41732H5.99596L6.39596 2.91732H5.18451ZM7.23989 2.91732L6.83989 5.41732H9.80126V2.91732H7.23989ZM10.6346 2.91732V5.41732H13.596L13.196 2.91732H10.6346ZM14.0399 2.91732L14.4399 5.41732H16.5471L16.0252 3.78635C15.8595 3.26862 15.3783 2.91732 14.8347 2.91732H14.0399ZM16.8138 6.25065H14.5732L14.9482 8.5944H17.5638L16.8138 6.25065ZM17.8304 9.42774H15.0816L15.5732 12.5007H17.1013C17.9482 12.5007 18.55 11.6763 18.2919 10.8697L17.8304 9.42774ZM14.7293 12.5007L14.2376 9.42774H10.6346V12.5007H14.7293ZM9.80126 12.5007V9.42774H6.19823L5.70656 12.5007H9.80126ZM4.86263 12.5007L5.35429 9.42774H2.18874L1.72732 10.8697C1.46921 11.6763 2.07097 12.5007 2.91785 12.5007H4.86263ZM2.45541 8.5944H5.48763L5.86263 6.25065H3.20541L2.45541 8.5944ZM6.70656 6.25065L6.33156 8.5944H9.80126V6.25065H6.70656ZM10.6346 6.25065V8.5944H14.1043L13.7293 6.25065H10.6346Z" fill="currentColor"></path>
                      </svg>`,
        heatpump: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.39375 4.04545C3.11416 4.04545 2.8875 4.27949 2.8875 4.56818V17.1136C2.8875 17.4023 3.11416 17.6364 3.39375 17.6364H20.6063C20.8858 17.6364 21.1125 17.4023 21.1125 17.1136V4.56818C21.1125 4.27949 20.8858 4.04545 20.6063 4.04545H3.39375ZM1.875 4.56818C1.875 3.7021 2.55497 3 3.39375 3H20.6063C21.445 3 22.125 3.7021 22.125 4.56818V17.1136C22.125 17.9797 21.445 18.6818 20.6063 18.6818H19.0875V19.4136C19.0875 19.8755 18.7249 20.25 18.2775 20.25H16.3538C15.9064 20.25 15.5438 19.8755 15.5438 19.4136V18.6818H8.45625V19.4136C8.45625 19.8755 8.0936 20.25 7.64625 20.25H5.7225C5.27515 20.25 4.9125 19.8755 4.9125 19.4136V18.6818H3.39375C2.55497 18.6818 1.875 17.9797 1.875 17.1136V4.56818ZM5.925 18.6818V19.2045H7.44375V18.6818H5.925ZM16.5563 18.6818V19.2045H18.075V18.6818H16.5563ZM3.9 10.8409C3.9 7.66527 6.39321 5.09091 9.46875 5.09091C12.5443 5.09091 15.0375 7.66527 15.0375 10.8409C15.0375 14.0165 12.5443 16.5909 9.46875 16.5909C6.39321 16.5909 3.9 14.0165 3.9 10.8409ZM4.94031 10.3182H13.9972C13.9375 9.76023 13.7832 9.23169 13.5514 8.75H5.38611C5.15427 9.23169 5.00004 9.76023 4.94031 10.3182ZM6.07266 7.70455H12.8648C12.0306 6.74207 10.8182 6.13636 9.46875 6.13636C8.11934 6.13636 6.90694 6.74207 6.07266 7.70455ZM13.9972 11.3636H4.94031C5.00004 11.9216 5.15427 12.4501 5.38611 12.9318H13.5514C13.7832 12.4501 13.9375 11.9216 13.9972 11.3636ZM12.8648 13.9773H6.07266C6.90694 14.9397 8.11934 15.5455 9.46875 15.5455C10.8182 15.5455 12.0306 14.9397 12.8648 13.9773Z" fill="currentColor"></path>
                         </svg>`,
        airconditioning: `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.18118 16.6654C5.28847 16.4328 5.20796 16.1742 4.96642 16.0449C4.72488 15.9416 4.45636 16.0191 4.32214 16.2517C3.89262 17.1049 3.89262 18.1132 4.32214 18.9404C4.61742 19.535 4.61742 20.2331 4.32214 20.8277C4.21486 21.0603 4.29537 21.319 4.53691 21.4482C4.59065 21.474 4.67116 21.5 4.75168 21.5C4.9127 21.5 5.10069 21.3967 5.1812 21.2414C5.61073 20.3882 5.61073 19.3799 5.1812 18.5527C4.88592 17.9839 4.8859 17.26 5.18118 16.6654Z" fill="currentColor"></path>
                            <path d="M8.80466 16.6654C8.91195 16.4328 8.83144 16.1742 8.5899 16.0449C8.34836 15.9416 8.07984 16.0191 7.94563 16.2517C7.5161 17.1049 7.5161 18.1132 7.94563 18.9404C8.2409 19.535 8.2409 20.2331 7.94563 20.8277C7.83834 21.0603 7.91885 21.319 8.16039 21.4482C8.21413 21.474 8.29464 21.5 8.37516 21.5C8.53618 21.5 8.72417 21.3967 8.80468 21.2414C9.23421 20.3882 9.23421 19.3799 8.80468 18.5527C8.48263 17.9839 8.48261 17.26 8.80466 16.6654Z" fill="currentColor"></path>
                            <path d="M12.4309 16.6654C12.5382 16.4328 12.4576 16.1742 12.2161 16.0449C11.9746 15.9416 11.706 16.0191 11.5718 16.2517C11.1423 17.1049 11.1423 18.1132 11.5718 18.9404C11.8671 19.535 11.8671 20.2331 11.5718 20.8277C11.4645 21.0603 11.5451 21.319 11.7866 21.4482C11.8403 21.474 11.9209 21.5 12.0014 21.5C12.1624 21.5 12.3504 21.3967 12.4309 21.2414C12.8604 20.3882 12.8604 19.3799 12.4309 18.5527C12.1087 17.9839 12.1086 17.26 12.4309 16.6654Z" fill="currentColor"></path>
                            <path d="M16.0544 16.6654C16.1616 16.4328 16.0811 16.1742 15.8396 16.0449C15.598 15.9416 15.3295 16.0191 15.1953 16.2517C14.7658 17.1049 14.7658 18.1132 15.1953 18.9404C15.4906 19.535 15.4906 20.2331 15.1953 20.8277C15.088 21.0603 15.1685 21.319 15.4101 21.4482C15.4638 21.474 15.5443 21.5 15.6248 21.5C15.7859 21.5 15.9739 21.3967 16.0544 21.2414C16.4839 20.3882 16.4839 19.3799 16.0544 18.5527C15.7323 17.9839 15.7323 17.26 16.0544 16.6654Z" fill="currentColor"></path>
                            <path d="M19.6778 16.6654C19.7851 16.4328 19.7046 16.1742 19.4631 16.0449C19.2215 15.9416 18.953 16.0191 18.8188 16.2517C18.3893 17.1049 18.3893 18.1132 18.8188 18.9404C19.1141 19.535 19.1141 20.2331 18.8188 20.8277C18.7115 21.0603 18.792 21.319 19.0336 21.4482C19.0873 21.474 19.1678 21.5 19.2483 21.5C19.4094 21.5 19.5973 21.3967 19.6779 21.2414C20.1074 20.3882 20.1074 19.3799 19.6779 18.5527C19.3558 17.9839 19.3558 17.26 19.6778 16.6654Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21 4.3C21 3.85817 20.6418 3.5 20.2 3.5H3.8C3.35817 3.5 3 3.85817 3 4.3V8.5H21V4.3ZM21 9.5H3V12.8834C3 13.224 3.27604 13.5 3.61656 13.5L3.98629 12.1135C4.16139 11.4569 4.75607 11 5.43564 11H18.5658C19.2453 11 19.84 11.4569 20.0151 12.1135L20.3848 13.5C20.7246 13.5 21 13.2246 21 12.8848V9.5ZM19.3499 13.5H4.6515L4.89314 12.5939C4.98652 12.2437 5.30368 12 5.66612 12H18.3353C18.6977 12 19.0149 12.2437 19.1083 12.5939L19.3499 13.5ZM3.5 2.5C2.67157 2.5 2 3.17157 2 4V13C2 13.8284 2.67157 14.5 3.5 14.5H20.5C21.3284 14.5 22 13.8284 22 13V4C22 3.17157 21.3284 2.5 20.5 2.5H3.5Z" fill="currentColor"></path>
                            <path d="M17 6C17 5.72386 17.2239 5.5 17.5 5.5H18.5C18.7761 5.5 19 5.72386 19 6C19 6.27614 18.7761 6.5 18.5 6.5H17.5C17.2239 6.5 17 6.27614 17 6Z" fill="currentColor"></path>
                          </svg>`,
        homebattery: `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6101 2.56854C8.89251 2.07047 6.10787 2.07049 3.39022 2.56853C3.05568 2.62984 2.8125 2.92354 2.8125 3.26624V6.06003H12.1878V3.26618C12.1878 2.92349 11.9446 2.62984 11.6101 2.56854ZM12.1878 7.00503H2.8125V17.3588C2.8125 17.7015 3.05568 17.9952 3.39022 18.0565C6.10787 18.5545 8.89251 18.5545 11.6101 18.0565C11.9446 17.9952 12.1878 17.7015 12.1878 17.3588V7.00503ZM3.22252 1.63878C6.05106 1.12042 8.94931 1.1204 11.7779 1.63879C12.5581 1.78179 13.1253 2.46679 13.1253 3.26618V7.47752H13.5937C14.3704 7.47752 15 8.11215 15 8.89501V15.51C15 15.7709 15.2099 15.9825 15.4687 15.9825C15.7276 15.9825 15.9375 15.7709 15.9375 15.51V5.95966H15.419C14.6698 5.95966 14.0625 5.3475 14.0625 4.59236C14.0625 3.9846 14.4559 3.46945 15 3.29152V2.28006C15 2.01911 15.2099 1.80757 15.4687 1.80757C15.7276 1.80757 15.9375 2.01911 15.9375 2.28006V3.22506H16.875V2.28006C16.875 2.01911 17.0849 1.80757 17.3437 1.80757C17.6026 1.80757 17.8125 2.01911 17.8125 2.28006V3.29152C18.3566 3.46945 18.75 3.9846 18.75 4.59236C18.75 5.3475 18.1427 5.95966 17.3935 5.95966H16.875V15.51C16.875 16.2928 16.2454 16.9274 15.4687 16.9274C14.6921 16.9274 14.0625 16.2928 14.0625 15.51V8.89501C14.0625 8.63406 13.8526 8.42251 13.5937 8.42251H13.1253V17.3588C13.1253 18.1582 12.5581 18.8432 11.7779 18.9862C8.94931 19.5046 6.05106 19.5046 3.22252 18.9862C2.44224 18.8432 1.875 18.1582 1.875 17.3588V3.26624C1.875 2.4668 2.44224 1.78177 3.22252 1.63878ZM15.419 4.17005C15.1876 4.17005 15 4.35912 15 4.59236C15 4.82559 15.1876 5.01467 15.419 5.01467H17.3935C17.6249 5.01467 17.8125 4.82559 17.8125 4.59236C17.8125 4.35912 17.6249 4.17005 17.3935 4.17005H15.419Z" fill="currentColor"></path>
                        <path d="M6.28375 12.3888L7.23194 9.84006C7.30523 9.64305 7.595 9.69601 7.595 9.90643V11.4156C7.595 11.5722 7.72092 11.6991 7.87625 11.6991H8.73069C8.8616 11.6991 8.95222 11.8309 8.90625 11.9545L7.95806 14.5032C7.88477 14.7002 7.595 14.6473 7.595 14.4368V12.9276C7.595 12.7711 7.46908 12.6441 7.31375 12.6441H6.45931C6.3284 12.6441 6.23778 12.5123 6.28375 12.3888Z" fill="currentColor"></path>
                      </svg>`,
        carcharger: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.2002 1C7.86865 1 7.6001 1.26855 7.6001 1.6001V4H7.5C5.29077 4 3.5 5.79077 3.5 8V12C3.5 16.4182 7.08179 20 11.5 20H11.3999V22.3999C11.3999 22.7314 11.6685 23 12 23C12.3313 23 12.5999 22.7314 12.5999 22.3999V20H12.5C16.9182 20 20.5 16.4182 20.5 12V8C20.5 5.79077 18.7092 4 16.5 4H16.3999V1.6001C16.3999 1.5127 16.3813 1.42969 16.3477 1.35474C16.2539 1.14551 16.0439 1 15.8 1C15.4685 1 15.2 1.26855 15.2 1.6001V4H8.80005V1.6001C8.80005 1.26855 8.53149 1 8.2002 1ZM16.5 5.19995H7.5C5.95361 5.19995 4.69995 6.45361 4.69995 8V12C4.69995 15.7556 7.74438 18.8 11.5 18.8H12.5C16.2556 18.8 19.3 15.7556 19.3 12V8C19.3 6.45361 18.0464 5.19995 16.5 5.19995ZM10.0183 12.0618L11.4548 8.24487C11.5657 7.94971 12.0046 8.02905 12.0046 8.34424V10.6042C12.0046 10.6321 12.0073 10.6592 12.0127 10.6855L12.0186 10.7122C12.0457 10.8157 12.1111 10.9038 12.199 10.9607C12.2659 11.0039 12.3455 11.0291 12.4309 11.0291H13.7251C13.9236 11.0291 14.0608 11.2263 13.9912 11.4114L12.5547 15.2283C12.491 15.3972 12.3198 15.4436 12.1851 15.3931C12.1294 15.3721 12.0798 15.3345 12.0469 15.2822C12.0205 15.2402 12.0046 15.189 12.0046 15.1289V12.8687C12.0046 12.6343 11.814 12.4441 11.5786 12.4441H10.2842C10.0859 12.4441 9.94873 12.2468 10.0183 12.0618Z" fill="currentColor"></path>
                     </svg>`,
        floorinsulation: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2237 4.18927C11.9063 4.04573 11.5368 4.0491 11.2223 4.19841L2.01788 8.56808C1.84778 8.64884 1.85012 8.88009 2.02183 8.95772L3.88432 9.79981L13.8538 4.92625L12.2237 4.18927ZM15.1495 5.51206L5.18 10.3856L8.08182 11.6976L18.1272 6.85838L15.1495 5.51206ZM19.4288 7.44687L9.38342 12.2861L11.5247 13.2543C12.0009 13.4696 12.5551 13.4645 13.0268 13.2405L21.9821 8.98916C22.1522 8.90841 22.1499 8.67715 21.9782 8.59952L19.4288 7.44687ZM2.56649 10.4046L1.53099 9.9364C0.500728 9.47059 0.486678 8.08308 1.50732 7.59855L10.7118 3.22888C11.3408 2.93026 12.0796 2.92352 12.7146 3.21059L22.469 7.62084C23.4993 8.08665 23.5133 9.47416 22.4927 9.95869L21.4256 10.4653L22.3993 10.8807C23.4531 11.3302 23.4838 12.7401 22.4505 13.2306L21.4256 13.7172L22.3993 14.1326C23.4531 14.5821 23.4838 15.992 22.4505 16.4825L13.5374 20.7139C12.7511 21.0872 11.8276 21.0956 11.0339 20.7368L1.64951 16.4938C0.584921 16.0125 0.615517 14.5639 1.69959 14.1235L2.70027 13.717L1.56778 13.2049C0.52646 12.7341 0.52646 11.3269 1.56778 10.8561L2.56649 10.4046ZM3.89421 11.0049L2.05861 11.8348C1.88506 11.9133 1.88506 12.1478 2.05861 12.2263L11.5247 16.5062C12.0009 16.7215 12.5551 16.7164 13.0268 16.4925L21.94 12.2611C22.1122 12.1793 22.1071 11.9443 21.9314 11.8694L20.1071 11.0912L13.5374 14.2101C12.7511 14.5833 11.8276 14.5918 11.0339 14.2329L3.89421 11.0049ZM4.07381 14.338L2.1487 15.1201C1.96802 15.1935 1.96292 15.4349 2.14035 15.5151L11.5247 19.7581C12.0009 19.9734 12.5551 19.9683 13.0268 19.7444L21.94 15.513C22.1122 15.4312 22.1071 15.1963 21.9314 15.1213L20.1071 14.3431L13.5374 17.462C12.7511 17.8353 11.8276 17.8437 11.0339 17.4848L4.07381 14.338Z" fill="currentColor"></path>
                          </svg>`,
        wallinsulation: `<svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.625 2.22222C5.35653 2.22222 5.13889 2.43986 5.13889 2.70833V4.16667H14.375C15.1804 4.16667 15.8333 4.81958 15.8333 5.625V14.8611H17.2917C17.5601 14.8611 17.7778 14.6435 17.7778 14.375V2.70833C17.7778 2.43986 17.5601 2.22222 17.2917 2.22222H5.625ZM15.8333 15.8333H17.2917C18.0971 15.8333 18.75 15.1804 18.75 14.375V2.70833C18.75 1.90292 18.0971 1.25 17.2917 1.25H5.625C4.81958 1.25 4.16667 1.90292 4.16667 2.70833V4.16667H2.70833C1.90292 4.16667 1.25 4.81959 1.25 5.625V17.2917C1.25 18.0971 1.90292 18.75 2.70833 18.75H14.375C15.1804 18.75 15.8333 18.0971 15.8333 17.2917V15.8333ZM2.70833 5.13889C2.43986 5.13889 2.22222 5.35653 2.22222 5.625V17.2917C2.22222 17.5601 2.43986 17.7778 2.70833 17.7778H14.375C14.6435 17.7778 14.8611 17.5601 14.8611 17.2917V5.625C14.8611 5.35653 14.6435 5.13889 14.375 5.13889H2.70833ZM6.11111 7.08333C6.37958 7.08333 6.59722 7.30097 6.59722 7.56944C6.59722 7.83792 6.37958 8.05556 6.11111 8.05556H5.13889C4.87042 8.05556 4.65278 7.83792 4.65278 7.56944C4.65278 7.30097 4.87042 7.08333 5.13889 7.08333H6.11111ZM10.4861 7.56944C10.4861 7.30097 10.7038 7.08333 10.9722 7.08333H11.9444C12.2129 7.08333 12.4306 7.30097 12.4306 7.56944C12.4306 7.83792 12.2129 8.05556 11.9444 8.05556H10.9722C10.7038 8.05556 10.4861 7.83792 10.4861 7.56944ZM9.02778 9.02778C9.29625 9.02778 9.51389 9.24542 9.51389 9.51389C9.51389 9.78236 9.29625 10 9.02778 10H8.05556C7.78708 10 7.56944 9.78236 7.56944 9.51389C7.56944 9.24542 7.78708 9.02778 8.05556 9.02778H9.02778ZM6.11111 10.9722C6.37958 10.9722 6.59722 11.1899 6.59722 11.4583C6.59722 11.7268 6.37958 11.9444 6.11111 11.9444H5.13889C4.87042 11.9444 4.65278 11.7268 4.65278 11.4583C4.65278 11.1899 4.87042 10.9722 5.13889 10.9722H6.11111ZM12.4306 11.4583C12.4306 11.7268 12.2129 11.9444 11.9444 11.9444H10.9722C10.7038 11.9444 10.4861 11.7268 10.4861 11.4583C10.4861 11.1899 10.7038 10.9722 10.9722 10.9722H11.9444C12.2129 10.9722 12.4306 11.1899 12.4306 11.4583ZM9.02778 12.9167C9.29625 12.9167 9.51389 13.1343 9.51389 13.4028C9.51389 13.6712 9.29625 13.8889 9.02778 13.8889H8.05556C7.78708 13.8889 7.56944 13.6712 7.56944 13.4028C7.56944 13.1343 7.78708 12.9167 8.05556 12.9167H9.02778ZM6.11111 14.8611C6.37958 14.8611 6.59722 15.0788 6.59722 15.3472C6.59722 15.6157 6.37958 15.8333 6.11111 15.8333H5.13889C4.87042 15.8333 4.65278 15.6157 4.65278 15.3472C4.65278 15.0788 4.87042 14.8611 5.13889 14.8611H6.11111ZM12.4306 15.3472C12.4306 15.6157 12.2129 15.8333 11.9444 15.8333H10.9722C10.7038 15.8333 10.4861 15.6157 10.4861 15.3472C10.4861 15.0788 10.7038 14.8611 10.9722 14.8611H11.9444C12.2129 14.8611 12.4306 15.0788 12.4306 15.3472Z" fill="currentColor"></path>
                         </svg>`,
        roofinsulation: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5309 3.41474C10.9546 2.86175 11.7963 2.86175 12.2199 3.41474L13.1225 4.5928L14.0243 3.41566C14.4484 2.86212 15.2912 2.86278 15.7144 3.417L16.6685 4.66646L17.4683 3.4888C17.8702 2.89696 18.7411 2.86691 19.1839 3.4296L20.1051 4.60016L21.0133 3.41474C21.437 2.86175 22.2787 2.86175 22.7024 3.41474L23.7857 4.82874C24.0714 5.20171 24.0714 5.71664 23.7857 6.08961L22.3873 7.91491V18.6189C22.3873 19.1961 21.9132 19.664 21.3284 19.664H13.9421L13.8508 19.7912C13.5203 20.2512 12.8797 20.3696 12.403 20.0585L10.9156 19.0878L10.3503 19.8256C10.0133 20.2655 9.38796 20.3712 8.92186 20.067L7.42145 19.0878L6.84882 19.8352C6.51789 20.2671 5.9075 20.378 5.44246 20.0906L3.82546 19.0914L3.3606 19.7671C3.03441 20.2413 2.38221 20.3677 1.89862 20.0505L0.472899 19.1152C-0.0252137 18.7885 -0.150502 18.1196 0.196305 17.6387L9.20147 5.14998L10.5309 3.41474ZM4.43426 18.2345L6.0043 19.2048L6.8733 18.0705L16.0356 5.57407L14.8689 4.04609L13.5483 5.76974L4.43426 18.2345ZM12.4643 5.46642L11.3754 4.04517L10.0552 5.76836L1.05894 18.2447L2.48465 19.18L3.24032 18.0815L12.4643 5.46642ZM8.05161 18.2461L9.50582 19.1951L10.3662 18.0721L19.4511 5.47281L18.3478 4.07078L17.1282 5.86655L8.05161 18.2461ZM20.5376 5.76838L11.5421 18.2437L12.987 19.1867L21.4307 7.43075L22.9412 5.45917L21.8579 4.04517L20.5376 5.76838ZM14.6928 18.6189H21.3284V9.38019L14.6928 18.6189Z" fill="currentColor"></path>
                         </svg>`,
        glassinsulation: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3.25C5 2.2835 5.7835 1.5 6.75 1.5H20.75C21.7165 1.5 22.5 2.2835 22.5 3.25V17.25C22.5 18.2165 21.7165 19 20.75 19H19V20.75C19 21.7165 18.2165 22.5 17.25 22.5H3.25C2.2835 22.5 1.5 21.7165 1.5 20.75V6.75C1.5 5.7835 2.2835 5 3.25 5H5V3.25ZM6.16667 5H17.25C18.2165 5 19 5.7835 19 6.75V17.8333H20.75C21.0722 17.8333 21.3333 17.5722 21.3333 17.25V3.25C21.3333 2.92783 21.0722 2.66667 20.75 2.66667H6.75C6.42783 2.66667 6.16667 2.92783 6.16667 3.25V5ZM3.25 6.16667C2.92783 6.16667 2.66667 6.42783 2.66667 6.75V20.75C2.66667 21.0722 2.92783 21.3333 3.25 21.3333H17.25C17.5722 21.3333 17.8333 21.0722 17.8333 20.75V6.75C17.8333 6.42783 17.5722 6.16667 17.25 6.16667H3.25Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.99581 7.50419C6.22362 7.73199 6.22362 8.10134 5.99581 8.32915L4.82915 9.49581C4.60134 9.72362 4.23199 9.72362 4.00419 9.49581C3.77638 9.26801 3.77638 8.89866 4.00419 8.67085L5.17085 7.50419C5.39866 7.27638 5.76801 7.27638 5.99581 7.50419Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1625 15.6709C14.3903 15.8987 14.3903 16.268 14.1625 16.4958L12.9958 17.6625C12.768 17.8903 12.3987 17.8903 12.1709 17.6625C11.943 17.4347 11.943 17.0653 12.1709 16.8375L13.3375 15.6709C13.5653 15.443 13.9347 15.443 14.1625 15.6709Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4958 18.0042C16.7236 18.232 16.7236 18.6013 16.4958 18.8291L15.3291 19.9958C15.1013 20.2236 14.732 20.2236 14.5042 19.9958C14.2764 19.768 14.2764 19.3987 14.5042 19.1709L15.6709 18.0042C15.8987 17.7764 16.268 17.7764 16.4958 18.0042Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.32915 7.50419C8.55695 7.73199 8.55695 8.10134 8.32915 8.32915L4.82915 11.8291C4.60134 12.057 4.23199 12.057 4.00419 11.8291C3.77638 11.6013 3.77638 11.232 4.00419 11.0042L7.50419 7.50419C7.73199 7.27638 8.10134 7.27638 8.32915 7.50419Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4958 15.6709C16.7236 15.8987 16.7236 16.268 16.4958 16.4958L12.9958 19.9958C12.768 20.2236 12.3987 20.2236 12.1709 19.9958C11.943 19.768 11.943 19.3987 12.1709 19.1709L15.6709 15.6709C15.8987 15.443 16.268 15.443 16.4958 15.6709Z" fill="currentColor"></path>
                          </svg>`,
    };

    // Add translations for international address fields
    const translations = {
        en: {
            city: "City",
            zipcode: "Zipcode",
            street: "Street",
            housenumber: "Housenumber",
            cityPlaceholder: "London",
            zipcodePlaceholder: "SW1A 0AA",
            streetPlaceholder: "Downing St",
            housenumberPlaceholder: "10",
            phoneLabel: "Phone Number",
            emailLabel: "E-mail",
            dropdownLabel: "Make a choice",
            dropdownPlaceholder: "Make a choice",
            addressLabel: "Address",
            addressPlaceholder: "Start typing your address...",
            validation: {
                city: "Please enter a city.",
                zipcode: "Please enter a valid zipcode.",
                street: "Please enter a street.",
                housenumber: "Please enter a valid housenumber.",
                phone: "Please enter a valid phone number.",
                phoneRequired: "Please enter a phone number.",
                email: "Please enter a valid e-mail address.",
                emailRequired: "Please enter an e-mail address.",
                dropdown: "Please select an option.",
                address: "Please enter a valid address.",
            },
        },
        nl: {
            city: "Stad",
            zipcode: "Postcode",
            street: "Straat",
            housenumber: "Huisnummer",
            cityPlaceholder: "Antwerpen",
            zipcodePlaceholder: "2018",
            streetPlaceholder: "Stationslaan",
            housenumberPlaceholder: "45",
            phoneLabel: "Telefoonnummer",
            emailLabel: "E-mail",
            dropdownLabel: "Maak een keuze",
            dropdownPlaceholder: "Maak een keuze",
            addressLabel: "Adres",
            addressPlaceholder: "Begin met typen van uw adres...",
            validation: {
                city: "Vul een stad in.",
                zipcode: "Vul een geldige postcode in.",
                street: "Vul een straat in.",
                housenumber: "Vul een geldig huisnummer in.",
                phone: "Vul een geldig telefoonnummer in.",
                phoneRequired: "Vul een telefoonnummer in.",
                email: "Vul een geldig e-mailadres in.",
                emailRequired: "Vul een e-mailadres in.",
                dropdown: "Selecteer een maatregel.",
                address: "Vul een geldig adres in.",
            },
        },
        fr: {
            city: "Ville",
            zipcode: "Code Postal",
            street: "Rue",
            housenumber: "Numéro de Maison",
            cityPlaceholder: "Paris",
            zipcodePlaceholder: "75001",
            streetPlaceholder: "Rue de Rivoli",
            housenumberPlaceholder: "1",
            phoneLabel: "Numéro de Téléphone",
            emailLabel: "E-mail",
            dropdownLabel: "Faites un choix",
            dropdownPlaceholder: "Faites un choix",
            addressLabel: "Adresse",
            addressPlaceholder: "Commencez à taper votre adresse...",
            validation: {
                city: "Veuillez entrer une ville.",
                zipcode: "Veuillez entrer un code postal valide.",
                street: "Veuillez entrer une rue.",
                housenumber: "Veuillez entrer un numéro de maison valide.",
                phone: "Veuillez entrer un numéro de téléphone valide.",
                phoneRequired: "Veuillez entrer un numéro de téléphone.",
                email: "Veuillez entrer une adresse e-mail valide.",
                emailRequired: "Veuillez entrer une adresse e-mail.",
                dropdown: "Veuillez sélectionner une option.",
                address: "Veuillez entrer une adresse valide.",
            },
        },
        de: {
            city: "Stadt",
            zipcode: "Postleitzahl",
            street: "Straße",
            housenumber: "Hausnummer",
            cityPlaceholder: "Berlin",
            zipcodePlaceholder: "10117",
            streetPlaceholder: "Unter den Linden",
            housenumberPlaceholder: "1",
            phoneLabel: "Telefonnummer",
            emailLabel: "E-Mail",
            dropdownLabel: "Treffen Sie eine Wahl",
            dropdownPlaceholder: "Treffen Sie eine Wahl",
            addressLabel: "Adresse",
            addressPlaceholder: "Beginnen Sie mit der Eingabe Ihrer Adresse...",
            validation: {
                city: "Bitte geben Sie eine Stadt ein.",
                zipcode: "Bitte geben Sie eine gültige Postleitzahl ein.",
                street: "Bitte geben Sie eine Straße ein.",
                housenumber: "Bitte geben Sie eine gültige Hausnummer ein.",
                phone: "Bitte geben Sie eine gültige Telefonnummer ein.",
                phoneRequired: "Bitte geben Sie eine Telefonnummer ein.",
                email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
                emailRequired: "Bitte geben Sie eine E-Mail-Adresse ein.",
                dropdown: "Bitte wählen Sie eine Option aus.",
                address: "Bitte geben Sie eine gültige Adresse ein.",
            },
        },
        // Default dutch validation messages for existing fields
        dutchValidation: {
            postcode: "Vul een geldige postcode in.",
            postcodeFormat: "Vul een geldige postcode in, bijvoorbeeld 1234AB.",
            huisnummer: "Vul een geldig huisnummer in.",
            phone: "Vul een geldig telefoonnummer in.",
            phoneRequired: "Vul een telefoonnummer in.",
            email: "Vul een geldig e-mailadres in.",
            emailRequired: "Vul een e-mailadres in.",
            dropdown: "Selecteer een maatregel.",
        },
    };

    // Rate limiting for Google Places API
    const rateLimiter = {
        requests: [],
        maxRequests: 50, // Max requests per minute
        timeWindow: 60000, // 1 minute in milliseconds

        canMakeRequest: function () {
            const now = Date.now();
            // Remove old requests outside time window
            this.requests = this.requests.filter(
                (time) => now - time < this.timeWindow
            );

            if (this.requests.length >= this.maxRequests) {
                return false;
            }

            this.requests.push(now);
            return true;
        },
    };

    // Google Places API loading and management
    let googleApiPromise = null;
    const GOOGLE_API_KEY = "AIzaSyAGOPVG4UinlU37eP7p-Jim3eigcWwLwsA";

    function loadGooglePlacesAPI() {
        if (googleApiPromise) {
            return googleApiPromise;
        }

        googleApiPromise = new Promise((resolve, reject) => {
            if (
                window.google &&
                window.google.maps &&
                window.google.maps.places
            ) {
                console.log("Google Places API already loaded");
                resolve(window.google);
                return;
            }

            console.log("Loading Google Places API...");
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&loading=async`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                console.log("Google API script loaded successfully");
                // Add a small delay to ensure the API is fully initialized
                setTimeout(() => {
                    if (
                        window.google &&
                        window.google.maps &&
                        window.google.maps.places
                    ) {
                        console.log(
                            "Google Places API initialized successfully"
                        );
                        resolve(window.google);
                    } else {
                        const errorMsg = `Google Places API failed to initialize. Available: google=${!!window.google}, maps=${!!(
                            window.google && window.google.maps
                        )}, places=${!!(
                            window.google &&
                            window.google.maps &&
                            window.google.maps.places
                        )}`;
                        console.error(errorMsg);
                        reject(new Error(errorMsg));
                    }
                }, 100);
            };

            script.onerror = (event) => {
                const errorMsg = `Failed to load Google Places API script. Error: ${
                    event.error ||
                    event.message ||
                    "Unknown script loading error"
                }. URL: ${script.src}`;
                console.error(errorMsg, event);
                reject(new Error(errorMsg));
            };

            document.head.appendChild(script);
        });

        return googleApiPromise;
    }

    // Parse address manually if Google API fails or user enters text directly
    function parseAddressManually(addressText, addressFormat, country) {
        if (!addressText || typeof addressText !== "string") {
            return null;
        }

        const address = addressText.trim();

        if (addressFormat === "dutch") {
            // Dutch address patterns: be flexible with spacing and formatting
            // Try to extract Dutch postcode pattern - handle various formats: "1234AB", "1234 AB", etc.
            const postcodeMatch = address.match(
                /\b([1-9]\d{3}\s*[A-Za-z]{2})\b/
            );
            if (!postcodeMatch) {
                return null; // No valid Dutch postcode found
            }

            const postcode = postcodeMatch[1].replace(/\s+/g, "").toUpperCase();
            const postcodeIndex = address.indexOf(postcodeMatch[1]);

            // Extract house number - be more flexible, look for any number pattern before postcode
            const beforePostcode = address.substring(0, postcodeIndex).trim();

            // Try multiple patterns for house number extraction
            let houseNumberMatch = beforePostcode.match(
                /(\d+\s*[A-Za-z]*)\s*,?\s*$/
            ); // Standard: "123A"
            if (!houseNumberMatch) {
                // Try alternative patterns - number anywhere in the string
                houseNumberMatch = beforePostcode.match(/.*?(\d+\s*[A-Za-z]*)/);
            }

            if (!houseNumberMatch) {
                return null; // No house number found
            }

            const fullHouseNumber = houseNumberMatch[1].trim();
            const houseNumberOnly = fullHouseNumber.match(/^\d+/);
            const addition = fullHouseNumber.replace(/^\d+\s*/, "") || "";

            if (!houseNumberOnly) {
                return null;
            }

            return {
                valid: true,
                postcode: postcode,
                huisnummer: houseNumberOnly[0],
                toevoeging: addition,
            };
        } else {
            // International address parsing - be flexible with different formats
            // Handle both comma-separated and space-separated addresses
            let lines;
            if (address.includes(",")) {
                lines = address.split(",").map((line) => line.trim());
            } else {
                // For addresses without commas, try to split smartly
                // Look for postal code patterns to split the address
                const zipMatch = address.match(
                    /\b(\d{4,5}|[A-Za-z]{1,2}\d{1,2}\s*\d[A-Za-z]{2})\s+([A-Za-z\s]+)$/
                );
                if (zipMatch) {
                    const beforeZip = address
                        .substring(0, address.indexOf(zipMatch[0]))
                        .trim();
                    const zipAndCity = zipMatch[0];
                    lines = [beforeZip, zipAndCity];
                } else {
                    // Fallback: treat as single line
                    lines = [address];
                }
            }

            if (lines.length < 1) {
                return null;
            }

            // Try to extract postal code and city from the last part
            let zipcode = "";
            let city = "";

            const lastLine = lines[lines.length - 1];

            // More flexible postal code patterns
            const zipPatterns = [
                /\b(\d{4,5})\s+([A-Za-z\s]+)$/, // Germany, Netherlands: "12345 Berlin"
                /\b(\d{5})\s+([A-Za-z\s]+)$/, // France, Spain: "75001 Paris"
                /\b([A-Za-z]{1,2}\d{1,2}\s*\d[A-Za-z]{2})\s+([A-Za-z\s]+)$/, // UK: "SW1A 0AA London"
                /\b(\d{4,6})\s*([A-Za-z\s]+)$/, // Generic: any 4-6 digit code
            ];

            for (const pattern of zipPatterns) {
                const match = lastLine.match(pattern);
                if (match) {
                    zipcode = match[1].replace(/\s+/g, "").trim();
                    city = match[2].trim();
                    break;
                }
            }

            if (!zipcode || !city) {
                // More flexible fallback - try to find any number sequence as zipcode
                const words = lastLine.split(/\s+/);
                if (words.length >= 2) {
                    // Look for a word that contains mostly digits
                    for (let i = 0; i < words.length - 1; i++) {
                        if (words[i].match(/\d{3,}/)) {
                            zipcode = words[i];
                            city = words.slice(i + 1).join(" ");
                            break;
                        }
                    }
                }

                // Final fallback
                if (!zipcode && words.length >= 1) {
                    city = words[words.length - 1];
                    const zipMatch = lastLine.match(/\d{3,}/);
                    zipcode = zipMatch ? zipMatch[0] : "";
                }
            }

            // Extract street and house number from first line (or combined if single line)
            let street = "";
            let housenumber = "";

            const firstLine = lines[0];

            // More flexible house number extraction
            let streetMatch = firstLine.match(/^(.+?)\s+(\d+\s*[A-Za-z]*)\s*$/); // Standard: "Street 123A"
            if (!streetMatch) {
                streetMatch = firstLine.match(/^(.+?)(\d+[A-Za-z]*)\s*$/); // No space: "Street123A"
            }
            if (!streetMatch) {
                streetMatch = firstLine.match(/^(.+?)\s+(\d+)/); // Just number: "Street 123"
            }

            if (streetMatch) {
                street = streetMatch[1].trim();
                housenumber = streetMatch[2].trim();
            } else {
                // Final fallback: treat entire first line as street, extract any number
                street = firstLine.replace(/\s*\d+.*$/, "").trim(); // Remove number part
                const numberMatch = firstLine.match(/\d+/);
                housenumber = numberMatch ? numberMatch[0] : "1";

                // If we removed too much, keep the original
                if (!street) {
                    street = firstLine;
                }
            }

            // More lenient validation - we need at least street and either zipcode or city
            if (!street || (!zipcode && !city)) {
                return null;
            }

            // Provide defaults for missing values
            if (!housenumber) housenumber = "1";
            if (!zipcode) zipcode = "";
            if (!city) city = "";

            return {
                valid: true,
                street: street,
                housenumber: housenumber,
                zipcode: zipcode,
                city: city,
            };
        }
    }

    // Setup Google Places Autocomplete with custom dropdown
    function setupGoogleAutocomplete(
        input,
        country,
        addressFormat,
        form,
        language
    ) {
        if (!rateLimiter.canMakeRequest()) {
            console.warn("Rate limit exceeded for Google Places API");
            return;
        }

        // Map language codes to proper locale formats
        const languageMap = {
            nl: "nl-NL",
            en: "en-US",
            fr: "fr-FR",
            de: "de-DE",
        };

        const locale = languageMap[language] || "en-US";

        loadGooglePlacesAPI()
            .then((google) => {
                console.log(
                    "Google API loaded, setting up custom autocomplete"
                );

                // We'll use the new Place Autocomplete Data API
                // No service initialization needed

                // Store the original parent and next sibling for proper insertion
                const originalParent = input.parentNode;
                const nextSibling = input.nextSibling;

                // Create custom dropdown structure
                const container = document.createElement("div");
                container.className = "custom-dropdown address-autocomplete";

                const inputWrapper = document.createElement("div");
                inputWrapper.className = "address-input-wrapper";

                // Update the input styling
                input.className =
                    "embed-input-field address-autocomplete-input";
                input.setAttribute("autocomplete", "off");

                const dropdownIcon = document.createElement("div");
                dropdownIcon.className = "dropdown-icon";
                dropdownIcon.innerHTML = `
                    <svg class="search-icon" viewBox="0 0 24 24" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                        </svg>
                    `;

                const dropdown = document.createElement("div");
                dropdown.className = "dropdown-options address-dropdown";

                // First remove the input from its current parent
                originalParent.removeChild(input);

                // Build the new structure
                inputWrapper.appendChild(input);
                inputWrapper.appendChild(dropdownIcon);
                container.appendChild(inputWrapper);
                container.appendChild(dropdown);

                // Insert the container where the input was
                if (nextSibling) {
                    originalParent.insertBefore(container, nextSibling);
                } else {
                    originalParent.appendChild(container);
                }

                // Store references and state
                let currentPredictions = [];
                let selectedIndex = -1;
                let isDropdownOpen = false;
                let searchTimeout;
                let sessionToken;

                // Store address data on the container
                container._addressData = null;
                container.setAttribute("data-selected-place", "false");

                // Initialize session token
                function refreshSessionToken() {
                    sessionToken =
                        new google.maps.places.AutocompleteSessionToken();
                }
                refreshSessionToken();

                function showDropdown() {
                    dropdown.classList.add("show");
                    isDropdownOpen = true;
                }

                function hideDropdown() {
                    dropdown.classList.remove("show");
                    isDropdownOpen = false;
                    selectedIndex = -1;
                }

                function updateDropdown(suggestions) {
                    dropdown.innerHTML = "";
                    currentPredictions = suggestions;

                    if (suggestions.length === 0) {
                        hideDropdown();
                        return;
                    }

                    suggestions.forEach((suggestion, index) => {
                        const placePrediction = suggestion.placePrediction;
                        const option = document.createElement("div");
                        option.className = "dropdown-option address-option";
                        option.innerHTML = `
                            <svg class="location-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                            </svg>
                            <div class="option-content">
                                <div class="prediction-main">${placePrediction.mainText.text.toString()}</div>
                                <div class="prediction-secondary">${
                                    placePrediction.secondaryText?.text.toString() ||
                                    ""
                                }</div>
                            </div>
                        `;

                        option.addEventListener("click", () => {
                            selectPrediction(placePrediction, index);
                        });

                        dropdown.appendChild(option);
                    });

                    showDropdown();
                }

                async function selectPrediction(placePrediction, index) {
                    if (!rateLimiter.canMakeRequest()) {
                        console.warn("Rate limit exceeded for place details");
                        return;
                    }

                    // Update the input value
                    input.value = placePrediction.text.text;
                    hideDropdown();

                    // Mark as selected
                    container.setAttribute("data-selected-place", "true");

                    try {
                        // Convert prediction to place and get details
                        const place = placePrediction.toPlace();
                        await place.fetchFields({
                            fields: ["addressComponents", "formattedAddress"],
                        });

                        if (
                            place.addressComponents &&
                            place.addressComponents.length > 0
                        ) {
                            const addressData = extractAddressComponents(
                                place.addressComponents,
                                addressFormat
                            );

                            // Store the extracted data
                            container._addressData = addressData;

                            // Clear any validation messages
                            const validationMessage =
                                container.nextElementSibling;
                            if (
                                validationMessage &&
                                validationMessage.classList.contains(
                                    "embed-validation-message"
                                )
                            ) {
                                validationMessage.remove();
                            }
                            input.style.borderColor = "";

                            // Refresh session token after successful selection
                            refreshSessionToken();
                        } else {
                            console.error(
                                "No address components found in place"
                            );
                        }
                    } catch (error) {
                        console.error("Error getting place details:", error);
                    }
                }

                function highlightOption(index) {
                    const options =
                        dropdown.querySelectorAll(".address-option");
                    options.forEach((option, i) => {
                        option.classList.toggle("highlighted", i === index);
                    });
                }

                // Input event handlers
                input.addEventListener("input", (e) => {
                    const value = e.target.value.trim();

                    // Reset selection state
                    container.setAttribute("data-selected-place", "false");
                    container._addressData = null;
                    selectedIndex = -1;

                    // Clear any validation messages
                    const validationMessage = container.nextElementSibling;
                    if (
                        validationMessage &&
                        validationMessage.classList.contains(
                            "embed-validation-message"
                        )
                    ) {
                        validationMessage.remove();
                    }
                    input.style.borderColor = "";

                    // Clear previous timeout
                    if (searchTimeout) {
                        clearTimeout(searchTimeout);
                    }

                    if (value.length < 2) {
                        hideDropdown();
                        return;
                    }

                    // Debounce the search
                    searchTimeout = setTimeout(async () => {
                        if (!rateLimiter.canMakeRequest()) {
                            console.warn(
                                "Rate limit exceeded for autocomplete search"
                            );
                            return;
                        }

                        try {
                            const request = {
                                input: value,
                                sessionToken: sessionToken,
                                language: locale,
                                region: country.toLowerCase(),
                            };

                            const { suggestions } =
                                await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
                                    request
                                );

                            if (suggestions && suggestions.length > 0) {
                                updateDropdown(suggestions);
                            } else {
                                updateDropdown([]);
                            }
                        } catch (error) {
                            console.warn("Autocomplete service error:", error);
                            hideDropdown();
                        }
                    }, 300);
                });

                // Keyboard navigation
                input.addEventListener("keydown", (e) => {
                    if (!isDropdownOpen || currentPredictions.length === 0) {
                        return;
                    }

                    switch (e.key) {
                        case "ArrowDown":
                            e.preventDefault();
                            selectedIndex = Math.min(
                                selectedIndex + 1,
                                currentPredictions.length - 1
                            );
                            highlightOption(selectedIndex);
                            break;
                        case "ArrowUp":
                            e.preventDefault();
                            selectedIndex = Math.max(selectedIndex - 1, -1);
                            highlightOption(selectedIndex);
                            break;
                        case "Enter":
                            e.preventDefault();
                            if (selectedIndex >= 0) {
                                const suggestion =
                                    currentPredictions[selectedIndex];
                                selectPrediction(
                                    suggestion.placePrediction,
                                    selectedIndex
                                );
                            }
                            break;
                        case "Escape":
                            hideDropdown();
                            break;
                    }
                });

                // Focus handlers
                input.addEventListener("focus", () => {
                    if (
                        input.value.trim().length >= 2 &&
                        currentPredictions.length > 0
                    ) {
                        showDropdown();
                    }
                });

                // Click outside to close
                document.addEventListener("click", (e) => {
                    if (!container.contains(e.target)) {
                        hideDropdown();
                    }
                });

                // Update the form's Google address input reference
                if (form.querySelector("#google-address")) {
                    // Replace the reference to point to our container
                    Object.defineProperty(container, "value", {
                        get: () => input.value,
                        set: (val) => {
                            input.value = val;
                        },
                    });

                    // Store original methods to avoid infinite recursion
                    const originalGetAttribute =
                        container.getAttribute.bind(container);
                    const originalSetAttribute =
                        container.setAttribute.bind(container);

                    // Add the same methods that might be called on it
                    container.getAttribute = (attr) => {
                        if (attr === "data-selected-place") {
                            return originalGetAttribute("data-selected-place");
                        }
                        return input.getAttribute(attr);
                    };
                    container.setAttribute = (attr, val) => {
                        if (attr === "data-selected-place") {
                            originalSetAttribute("data-selected-place", val);
                        } else {
                            input.setAttribute(attr, val);
                        }
                    };
                    container.nextElementSibling = input.nextElementSibling;
                    container.style = input.style;
                }

                console.log("Custom Google Places autocomplete setup complete");
            })
            .catch((error) => {
                console.error("Failed to setup Google Places Autocomplete:", {
                    error: error.message,
                    stack: error.stack,
                    country: country,
                    addressFormat: addressFormat,
                });
                console.log("Falling back to manual address parsing");
            });
    }

    // Extract address components from Google Places API response
    function extractAddressComponents(components, addressFormat) {
        const result = {};

        for (const component of components) {
            const types = component.types;

            if (types.includes("street_number")) {
                result.street_number =
                    component.longText || component.shortText;
            } else if (types.includes("route")) {
                result.route = component.longText || component.shortText;
            } else if (types.includes("locality")) {
                result.locality = component.longText || component.shortText;
            } else if (types.includes("administrative_area_level_1")) {
                result.administrative_area_level_1 =
                    component.longText || component.shortText;
            } else if (types.includes("country")) {
                result.country = component.shortText || component.longText;
            } else if (types.includes("postal_code")) {
                result.postal_code = component.longText || component.shortText;
            }
        }

        if (addressFormat === "dutch") {
            return {
                valid: !!(result.postal_code && result.street_number),
                postcode: result.postal_code || "",
                huisnummer: result.street_number || "",
                toevoeging: "", // Google doesn't typically provide this
            };
        } else {
            return {
                valid: !!(
                    result.route &&
                    result.street_number &&
                    result.postal_code &&
                    result.locality
                ),
                street: result.route || "",
                housenumber: result.street_number || "",
                zipcode: result.postal_code || "",
                city: result.locality || "",
            };
        }
    }

    function init() {
        // Load the CSS only once
        const cssPromise = new Promise((resolve) => {
            const existingLink = document.querySelector(
                'link[href*="embed-styles.css"]'
            );
            if (existingLink) {
                // Add a small delay even for existing CSS to ensure it's fully applied
                setTimeout(resolve, 200);
                return;
            }
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href =
                "https://configurator-accp.homezero.nl/embed/inline/embed-styles.css";
            link.onload = () => resolve();
            document.head.appendChild(link);
        });

        // Wait for CSS to load before initializing the form
        cssPromise.then(() => {
            const elements = document.querySelectorAll(
                "hz-embed:not([data-initialized])"
            );
            const utmParams = getQueryParams();

            elements.forEach(function (element) {
                // Mark the element as initialized immediately to prevent double initialization
                element.setAttribute("data-initialized", "true");

                // Create a new form for each element
                const form = document.createElement("form");
                form.className = "embed-form";

                const src = element.getAttribute("src");
                // Revert button text to use attribute or hardcoded default
                const buttonText =
                    element.getAttribute("data-button-text") || "Start Scan";
                const buttonRadius =
                    element.getAttribute("data-button-radius") || "10px";
                const primaryColor =
                    element.getAttribute("data-color") || "#2A6DF4";
                const installer = element.getAttribute("data-installer");
                const openNewTab =
                    element.getAttribute("data-open-new-tab") || "false";
                const showPhone =
                    element.getAttribute("data-show-phone") === "true";
                const showEmail =
                    element.getAttribute("data-show-email") === "true";
                const phoneRequired =
                    element.getAttribute("data-phone-required") === "true";
                const emailRequired =
                    element.getAttribute("data-email-required") === "true";
                const googleSearch =
                    element.getAttribute("data-google-search") === "true";
                const country = element.getAttribute("data-country") || "nl";
                const title = element.getAttribute("data-title");
                const subtitle = element.getAttribute("data-subtitle");
                const addressFormat =
                    element.getAttribute("data-address-format") || "dutch";
                const language = element.getAttribute("data-language") || "nl";
                const selectedLang = translations[language] || translations.nl; // Fallback to NL
                const dutchValidationMessages = translations.dutchValidation;

                // Add CSS variables for primary color
                form.style.setProperty("--primary-color", primaryColor);
                form.setAttribute("data-address-format", addressFormat); // Store format for submit handler

                form.onsubmit = function (e) {
                    e.preventDefault();

                    // Clear previous validation messages
                    form.querySelectorAll(".embed-validation-message").forEach(
                        function (message) {
                            message.remove();
                        }
                    );

                    // Custom validation
                    let isValid = true;
                    const currentAddressFormat = form.getAttribute(
                        "data-address-format"
                    );
                    const selected = form.querySelector(".dropdown-selected");
                    const selectedValue = selected
                        ? selected.getAttribute("data-value")
                        : null;
                    const phone = form.querySelector("#telefoon");
                    const email = form.querySelector("#email");

                    let url = src || selectedValue;
                    let addressParams = {};

                    // Check if using Google search
                    const googleAddressInput =
                        form.querySelector("#google-address");

                    if (googleAddressInput) {
                        // Handle our custom Google Places autocomplete
                        const addressText = googleAddressInput.value
                            ? googleAddressInput.value.trim()
                            : "";

                        // Check for the attribute on the container (address-autocomplete) or fallback to input
                        const addressContainer = googleAddressInput.closest(
                            ".address-autocomplete"
                        );
                        const selectedPlace =
                            addressContainer.getAttribute(
                                "data-selected-place"
                            ) === "true";

                        let addressData = null;

                        // Try to use stored Google Places data first - check both container and input for _addressData
                        const dataSource =
                            addressContainer || googleAddressInput;
                        if (selectedPlace && dataSource._addressData) {
                            addressData = dataSource._addressData;
                        }

                        // Fallback to manual parsing if Google data not available and there's text
                        if (
                            (!addressData || !addressData.valid) &&
                            addressText
                        ) {
                            addressData = parseAddressManually(
                                addressText,
                                currentAddressFormat,
                                country
                            );
                        }

                        // Validate: either we have valid address data OR there's manual text input
                        if (!addressData || !addressData.valid) {
                            if (!addressText) {
                                // No text and no valid address data
                                displayValidationMessage(
                                    googleAddressInput,
                                    selectedLang.validation.address
                                );
                                isValid = false;
                            } else {
                                // There's text but it couldn't be parsed
                                displayValidationMessage(
                                    googleAddressInput,
                                    selectedLang.validation.address
                                );
                                isValid = false;
                            }
                        } else {
                            // We have valid address data - map to URL parameters
                            if (currentAddressFormat === "dutch") {
                                addressParams = {
                                    Zipcode: addressData.postcode,
                                    Housenumber: addressData.huisnummer,
                                    Addition: addressData.toevoeging || "",
                                };
                            } else {
                                addressParams = {
                                    City: addressData.city,
                                    Zipcode: addressData.zipcode,
                                    Street: addressData.street,
                                    Housenumber: addressData.housenumber,
                                };
                            }
                        }
                    } else if (currentAddressFormat === "dutch") {
                        const postcode = form.querySelector("#postcode");
                        const huisnummer = form.querySelector("#huisnummer");
                        const toevoegingElement =
                            form.querySelector("#toevoeging");
                        const toevoeging = toevoegingElement
                            ? toevoegingElement.value
                            : "";

                        // Postcode validation
                        if (!postcode.value) {
                            displayValidationMessage(
                                postcode,
                                dutchValidationMessages.postcode
                            );
                            isValid = false;
                        } else if (
                            !postcode.value.match(
                                /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/
                            )
                        ) {
                            displayValidationMessage(
                                postcode,
                                dutchValidationMessages.postcodeFormat
                            );
                            isValid = false;
                        }

                        // Huisnummer validation
                        if (!huisnummer.value) {
                            displayValidationMessage(
                                huisnummer,
                                dutchValidationMessages.huisnummer
                            );
                            isValid = false;
                        }

                        if (isValid) {
                            addressParams = {
                                Zipcode: postcode.value.replace(/\s/g, ""), // Remove space for submission
                                Housenumber: huisnummer.value,
                                Addition: toevoeging,
                            };
                        }
                    } else {
                        // International address validation
                        const city = form.querySelector("#city");
                        const zipcode = form.querySelector("#zipcode");
                        const street = form.querySelector("#street");
                        const housenumber = form.querySelector("#housenumber");

                        if (!city.value) {
                            displayValidationMessage(
                                city,
                                selectedLang.validation.city
                            );
                            isValid = false;
                        }
                        if (!zipcode.value) {
                            displayValidationMessage(
                                zipcode,
                                selectedLang.validation.zipcode
                            );
                            isValid = false;
                        }
                        if (!street.value) {
                            displayValidationMessage(
                                street,
                                selectedLang.validation.street
                            );
                            isValid = false;
                        }
                        if (!housenumber.value) {
                            displayValidationMessage(
                                housenumber,
                                selectedLang.validation.housenumber
                            );
                            isValid = false;
                        }

                        if (isValid) {
                            addressParams = {
                                City: city.value,
                                Zipcode: zipcode.value,
                                Street: street.value,
                                Housenumber: housenumber.value,
                            };
                        }
                    }

                    // Dropdown validation (only if dropdown exists)
                    if (selected && !selectedValue) {
                        displayValidationMessage(
                            selected,
                            selectedLang.validation.dropdown
                        );
                        isValid = false;
                    }

                    // Phone validation
                    if (showPhone) {
                        if (
                            phone.value &&
                            !phone.value.match(/^\+?[0-9\s-]{7,20}$/)
                        ) {
                            displayValidationMessage(
                                phone,
                                selectedLang.validation.phone
                            );
                            isValid = false;
                        } else if (phoneRequired && !phone.value) {
                            displayValidationMessage(
                                phone,
                                selectedLang.validation.phoneRequired
                            );
                            isValid = false;
                        }
                    }

                    // Email validation
                    if (showEmail) {
                        if (
                            email.value &&
                            !email.value.match(
                                /^[A-Za-z0-9!#$%&'*+\=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/
                            )
                        ) {
                            displayValidationMessage(
                                email,
                                selectedLang.validation.email
                            );
                            isValid = false;
                        } else if (emailRequired && !email.value) {
                            displayValidationMessage(
                                email,
                                selectedLang.validation.emailRequired
                            );
                            isValid = false;
                        }
                    }

                    // If the form is valid, proceed with URL construction and navigation
                    if (isValid) {
                        url +=
                            "&ReferralURL=" +
                            encodeURIComponent(window.location.href); // Start with ReferralURL

                        // Add address parameters
                        Object.keys(addressParams).forEach(function (key) {
                            url += `&${key}=${encodeURIComponent(
                                addressParams[key]
                            )}`;
                        });

                        if (installer) {
                            url +=
                                "&InstallerID=" + encodeURIComponent(installer);
                        }
                        if (showPhone && phone.value) {
                            // Strip spaces from phone number before adding to URL
                            const strippedPhone = phone.value.replace(
                                /\s+/g,
                                ""
                            );
                            url +=
                                "&Phone=" + encodeURIComponent(strippedPhone);
                        }
                        if (showEmail && email.value) {
                            url += "&Email=" + encodeURIComponent(email.value);
                        }

                        // Append UTM parameters if present
                        Object.keys(utmParams).forEach(function (key) {
                            url +=
                                "&" +
                                key +
                                "=" +
                                encodeURIComponent(utmParams[key]);
                        });

                        // Check if the form should open in a new tab or in the same window
                        if (openNewTab === "true") {
                            window.open(url, "_blank");
                        } else {
                            window.location.href = url;
                        }
                    }
                };

                // Add title and subtitle if they exist
                if (title || subtitle) {
                    let headerHtml = '<div class="embed-header">';
                    if (title) {
                        headerHtml += `<h2 class="embed-title">${title}</h2>`;
                    }
                    if (subtitle) {
                        headerHtml += `<p class="embed-subtitle">${subtitle}</p>`;
                    }
                    headerHtml += "</div>";
                    form.innerHTML = headerHtml;
                }

                // If no src attribute, add a dropdown for measurement selection
                if (!src) {
                    const measurementOptions = Array.from(element.attributes)
                        .filter(
                            (attr) =>
                                attr.name.startsWith("data-measurement-") &&
                                attr.name.endsWith("-url")
                        )
                        .map((attr) => {
                            const type = attr.name
                                .replace("data-measurement-", "")
                                .replace("-url", "");
                            const title = element.getAttribute(
                                `data-measurement-${type}-title`
                            );
                            const icon = measurementIcons[type] || "";
                            return {
                                url: attr.value,
                                title: title,
                                icon: icon,
                            };
                        });

                    // Custom dropdown HTML using translated labels/placeholder
                    form.innerHTML += `
                        <div class="embed-row">
                            <div class="embed-col">
                                <div class="embed-form-container">
                                    <label class="embed-label-bold">${
                                        selectedLang.dropdownLabel
                                    }*</label>
                                    <div class="custom-dropdown">
                                        <div class="dropdown-selected" tabindex="0">${
                                            selectedLang.dropdownPlaceholder
                                        }</div>
                                        <div class="dropdown-options">
                                            ${measurementOptions
                                                .map(
                                                    (option) => `
                                                <div class="dropdown-option" data-value="${option.url}">
                                                    ${option.icon}
                                                    <span>${option.title}</span>
                                                </div>
                                            `
                                                )
                                                .join("")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                // Add address input fields based on format
                let addressFieldsHtml = "";
                if (googleSearch) {
                    // Use Google Places autocomplete instead of manual fields
                    addressFieldsHtml += `
                        <div class="embed-row">
                            <div class="embed-col">
                                <div class="embed-form-container">
                                    <label for="google-address" class="embed-label-bold">${selectedLang.addressLabel}*</label>
                                    <input type="text" id="google-address" class="embed-input-field" placeholder="${selectedLang.addressPlaceholder}" data-address-format="${addressFormat}" data-country="${country}">
                                </div>
                            </div>
                        </div>
                    `;
                } else if (addressFormat === "dutch") {
                    // Dutch uses hardcoded labels
                    addressFieldsHtml += `
                        <div class="embed-row">
                            <div class="embed-col">
                                <div class="embed-address-container">
                                    <div class="embed-form-container">
                                        <label for="postcode" class="embed-label-bold">Postcode*</label>
                                        <input type="text" id="postcode" class="embed-input-field" placeholder="1234AB" maxlength="7">
                                    </div>
                                    <div class="embed-form-container">
                                        <label for="huisnummer" class="embed-label-bold">Huisnummer*</label>
                                        <input type="text" inputmode="numeric" id="huisnummer" class="embed-input-field" placeholder="1" maxlength="10">
                                    </div>
                                    <div class="embed-form-container">
                                        <label for="toevoeging" class="embed-label-bold">Toevoeging</label>
                                        <input type="text" id="toevoeging" class="embed-input-field" placeholder="A" maxlength="10">
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // International Address Fields use translated labels in a 2x2 grid
                    addressFieldsHtml += `
                        <div class="embed-row">
                            <div class="embed-col">
                                <div class="embed-flex-container">
                                    <div class="embed-form-container embed-street">
                                        <label for="street" class="embed-label-bold">${selectedLang.street}*</label>
                                        <input type="text" id="street" class="embed-input-field" placeholder="${selectedLang.streetPlaceholder}" maxlength="100">
                                    </div>
                                    <div class="embed-form-container embed-housenumber">
                                        <label for="housenumber" class="embed-label-bold">${selectedLang.housenumber}*</label>
                                        <input type="text" id="housenumber" class="embed-input-field" placeholder="${selectedLang.housenumberPlaceholder}" maxlength="20">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="embed-row">
                            <div class="embed-col">
                                <div class="embed-flex-container">
                                    <div class="embed-form-container embed-zipcode">
                                        <label for="zipcode" class="embed-label-bold">${selectedLang.zipcode}*</label>
                                        <input type="text" id="zipcode" class="embed-input-field" placeholder="${selectedLang.zipcodePlaceholder}" maxlength="20">
                                    </div>
                                    <div class="embed-form-container embed-city">
                                        <label for="city" class="embed-label-bold">${selectedLang.city}*</label>
                                        <input type="text" id="city" class="embed-input-field" placeholder="${selectedLang.cityPlaceholder}" maxlength="100">
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                form.innerHTML += addressFieldsHtml;

                // Show phone number and/or email input fields if enabled, using translated labels
                let contactFieldsHtml = "";
                if (showPhone && showEmail) {
                    contactFieldsHtml = `
                        <div class="embed-row">
                            <div class="embed-col">
                                <div class="embed-flex-container">
                                    <div class="embed-form-container">
                                        <label for="telefoon" class="embed-label-bold">${
                                            selectedLang.phoneLabel
                                        }${
                        phoneRequired ? `<span>*</span>` : ""
                    }</label>
                                        <input type="tel" id="telefoon" class="embed-input-field" placeholder="0612345678" maxlength="20">
                                    </div>
                                    <div class="embed-form-container">
                                        <label for="email" class="embed-label-bold">${
                                            selectedLang.emailLabel
                                        }${
                        emailRequired ? `<span>*</span>` : ""
                    }</label>
                                        <input type="email" id="email" class="embed-input-field" placeholder="jandevries@gmail.com" maxlength="100">
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (showPhone) {
                    contactFieldsHtml = `
                        <div class="embed-row">
                            <div class="embed-col">
                                <div class="embed-form-container">
                                    <label for="telefoon" class="embed-label-bold">${
                                        selectedLang.phoneLabel
                                    }${
                        phoneRequired ? `<span>*</span>` : ""
                    }</label>
                                    <input type="tel" id="telefoon" class="embed-input-field" placeholder="0612345678" maxlength="20">
                                </div>
                            </div>
                        </div>
                    `;
                } else if (showEmail) {
                    contactFieldsHtml = `
                        <div class="embed-row">
                            <div class="embed-col">
                                <div class="embed-form-container">
                                    <label for="email" class="embed-label-bold">${
                                        selectedLang.emailLabel
                                    }${
                        emailRequired ? `<span>*</span>` : ""
                    }</label>
                                    <input type="email" id="email" class="embed-input-field" placeholder="jandevries@gmail.com" maxlength="100">
                                </div>
                            </div>
                        </div>
                    `;
                }
                form.innerHTML += contactFieldsHtml;

                // Add the submit button
                form.innerHTML += `
                    <button type="submit" class="embed-submit-button" style="background-color: ${primaryColor}">${buttonText}</button>
                `;

                // Overwrites the button radius based on the settings
                const submitButtons = form.querySelectorAll(
                    ".embed-submit-button"
                );
                submitButtons.forEach(function (button) {
                    button.style.setProperty(
                        "border-radius",
                        `${buttonRadius}`,
                        "important"
                    );
                });

                // Add event listeners for focus and blur to input fields
                const inputFields = form.querySelectorAll(".embed-input-field");
                inputFields.forEach(function (input) {
                    input.addEventListener("focus", function () {
                        this.style.borderColor = primaryColor; // Set border back to primary color on focus
                        const validationMessage = this.nextElementSibling;
                        if (
                            validationMessage &&
                            validationMessage.classList.contains(
                                "embed-validation-message"
                            )
                        ) {
                            validationMessage.remove();
                        }
                    });
                });

                if (!src) {
                    setupCustomDropdown(form, element, selectedLang);
                }

                // Setup Google Places autocomplete if enabled
                if (googleSearch) {
                    const googleAddressInput =
                        form.querySelector("#google-address");
                    if (googleAddressInput) {
                        setupGoogleAutocomplete(
                            googleAddressInput,
                            country,
                            addressFormat,
                            form,
                            language
                        );
                    }
                }

                element.appendChild(form);
            });
        });
    }

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const utmParams = {};
        ["utm_campaign", "utm_medium", "utm_source"].forEach(function (param) {
            const value = params.get(param);
            if (value) {
                utmParams[param] = value;
            }
        });
        return utmParams;
    }

    // Function to display a custom validation message
    function displayValidationMessage(inputElement, message) {
        const messageElement = document.createElement("div");
        messageElement.className = "embed-validation-message";
        messageElement.textContent = message;

        // For the custom dropdown, insert validation message below the element
        const selected = inputElement
            .closest(".embed-form")
            .querySelector(".dropdown-selected");

        // Check if this is a Google address autocomplete input
        const addressAutocompleteContainer = inputElement.closest(
            ".address-autocomplete"
        );

        if (inputElement === selected) {
            inputElement.parentElement.insertAdjacentElement(
                "afterend",
                messageElement
            );
        } else if (addressAutocompleteContainer) {
            // For Google address autocomplete, place message after the entire container
            addressAutocompleteContainer.insertAdjacentElement(
                "afterend",
                messageElement
            );
        } else {
            inputElement.insertAdjacentElement("afterend", messageElement);
        }

        inputElement.style.setProperty("border-color", "red", "important");
    }

    function setupCustomDropdown(form, element, selectedLang) {
        const selected = form.querySelector(".dropdown-selected");
        const options = form.querySelector(".dropdown-options");
        const optionItems = form.querySelectorAll(".dropdown-option");
        const preselectedId = element.getAttribute("data-preselected-option");

        // Add function to determine contrast color
        function getContrastColor(hexcolor) {
            // Remove the # if present
            hexcolor = hexcolor.replace("#", "");

            // Convert to RGB
            const r = parseInt(hexcolor.substr(0, 2), 16);
            const g = parseInt(hexcolor.substr(2, 2), 16);
            const b = parseInt(hexcolor.substr(4, 2), 16);

            // Calculate luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            // Return black or white based on luminance
            return luminance > 0.5 ? "#132039" : "#ffffff";
        }

        // Set the contrast color CSS variable
        const primaryColor = getComputedStyle(form)
            .getPropertyValue("--primary-color")
            .trim();
        const contrastColor = getContrastColor(primaryColor);
        form.style.setProperty("--contrast-color", contrastColor);

        // Update selected content with icon and text inside a flex container - Initial state uses placeholder
        selected.innerHTML = `
            <div class="selected-content">
                 <span>${selectedLang.dropdownPlaceholder}</span>
             </div>
             <svg class="chevron-icon" viewBox="5 7 14 10" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10l-6 6z"></path>
             </svg>
         `;

        // Toggle dropdown on click
        selected.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent the click from bubbling up
            options.classList.toggle("show");
            selected.classList.toggle("open");
            selected.style.borderColor = ""; // Clear red border on interaction
            const validationMessage = selected.parentElement.nextElementSibling;
            if (
                validationMessage &&
                validationMessage.classList.contains("embed-validation-message")
            ) {
                validationMessage.remove();
            }
        });

        // Close dropdown if clicked outside
        document.addEventListener("click", (e) => {
            // Check if click is outside both the selected element and the options dropdown
            if (!selected.contains(e.target) && !options.contains(e.target)) {
                options.classList.remove("show");
                selected.classList.remove("open");
            }
        });

        // Prevent clicks inside options from bubbling up to document
        options.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // Update option selection logic - Sets the selected content
        optionItems.forEach((option) => {
            option.addEventListener("click", (e) => {
                // ... (get value, remove/add 'selected' class) ...
                const value = option.getAttribute("data-value");

                // Remove selected class from all options
                optionItems.forEach((opt) => opt.classList.remove("selected"));
                option.classList.add("selected");

                // Update selected content with icon and text inside a flex container
                selected.innerHTML = `
                    <div class="selected-content">
                        <span class="selected-icon">${
                            option.querySelector("svg").outerHTML
                        }</span>
                        <span>${option.textContent.trim()}</span>
                    </div>
                    <svg class="chevron-icon" viewBox="5 7 14 10" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10l-6 6z"></path>
                    </svg>
                `;

                selected.setAttribute("data-value", value);
                options.classList.remove("show");
                selected.classList.remove("open");
            });
        });

        // Update preselected option handling - Sets the selected content
        if (preselectedId) {
            optionItems.forEach((option) => {
                const value = option.getAttribute("data-value");
                if (value && value.includes(preselectedId)) {
                    option.classList.add("selected");
                    selected.innerHTML = `
                        <div class="selected-content">
                            <span class="selected-icon">${
                                option.querySelector("svg").outerHTML
                            }</span>
                            <span>${option.textContent.trim()}</span>
                        </div>
                        <svg class="chevron-icon" viewBox="5 7 14 10" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16l-6-6 1.41-1.41L12 13.17l4.59-4.58L18 10l-6 6z"></path>
                        </svg>
                    `;
                    selected.setAttribute("data-value", value);
                }
            });
        }

        // Add checkmark SVG to each option
        optionItems.forEach((option) => {
            const optionContent = option.innerHTML;
            option.innerHTML = `
                <div class="option-content">${optionContent}</div>
                <svg class="checkmark-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_15612_140328)">
                        <path d="M10.0003 1.66602C8.35215 1.66602 6.74099 2.15476 5.37058 3.07044C4.00017 3.98611 2.93206 5.2876 2.30133 6.81032C1.6706 8.33304 1.50558 10.0086 1.82712 11.6251C2.14866 13.2416 2.94234 14.7265 4.10777 15.8919C5.27321 17.0573 6.75807 17.851 8.37458 18.1726C9.99109 18.4941 11.6666 18.3291 13.1894 17.6983C14.7121 17.0676 16.0136 15.9995 16.9292 14.6291C17.8449 13.2587 18.3337 11.6475 18.3337 9.99935C18.3337 8.905 18.1181 7.82137 17.6993 6.81032C17.2805 5.79927 16.6667 4.88061 15.8929 4.10679C15.1191 3.33297 14.2004 2.71914 13.1894 2.30035C12.1783 1.88156 11.0947 1.66602 10.0003 1.66602ZM13.5837 8.00768L9.77533 13.0077C9.6977 13.1085 9.598 13.1903 9.48388 13.2466C9.36977 13.3029 9.24426 13.3324 9.117 13.3327C8.99042 13.3334 8.86535 13.3052 8.75128 13.2503C8.63721 13.1955 8.53714 13.1153 8.45866 13.016L6.42533 10.4243C6.35803 10.3379 6.30841 10.239 6.27932 10.1334C6.25022 10.0278 6.24222 9.91745 6.25576 9.80873C6.2693 9.70001 6.30412 9.59502 6.35824 9.49975C6.41236 9.40449 6.48471 9.32082 6.57116 9.25352C6.74576 9.11759 6.96721 9.0566 7.18678 9.08395C7.2955 9.09749 7.40049 9.13231 7.49576 9.18643C7.59102 9.24054 7.67469 9.3129 7.742 9.39935L9.10033 11.1327L12.2503 6.96602C12.3171 6.87847 12.4004 6.80493 12.4956 6.74959C12.5908 6.69425 12.6959 6.6582 12.805 6.6435C12.9141 6.6288 13.0251 6.63573 13.1315 6.6639C13.2379 6.69207 13.3378 6.74093 13.4253 6.80768C13.5129 6.87444 13.5864 6.95778 13.6418 7.05296C13.6971 7.14814 13.7331 7.25328 13.7478 7.36239C13.7625 7.4715 13.7556 7.58244 13.7274 7.68887C13.6993 7.7953 13.6504 7.89513 13.5837 7.98268V8.00768Z" fill="white"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_15612_140328">
                            <rect width="20" height="20" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            `;
        });
    }

    init();
})();
