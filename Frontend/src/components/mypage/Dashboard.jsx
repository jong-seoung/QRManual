const Dashboard = ({ onSwitch }) => {
  return (
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* <!-- Mobile Header --> */}
      <header class="lg:hidden h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 shrink-0">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-slate-600 dark:text-slate-300">
            menu
          </span>
          <span class="font-bold text-lg">DocuQR</span>
        </div>
        <div
          class="size-8 rounded-full bg-slate-200 bg-cover bg-center"
          data-alt="User avatar"
        //   style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8yxth2f6KZYb9c91Cz9lARhXxBXh7OFFF9j4vHMeH0nh95zOMrQpaT-6NBr52yBOsf3yhMm1zW7yYUyGkgTs6jZ24lXsVCALvXir2A2p8cigmCd4Lai-WawaVQt0kVR9FCAUMlB_9eeCOsKhhmgs8bZMOmLqNKZqunpAhvhIzK7oqzCcmhKUypjH8JMjx4_OleOabEwQzrNWzyRllVRCA_bquF-yyob0PtXVstY5G-a8UqV_lMzpew8AIPjqIt4GW4WNWLHjA6Us');"
        ></div>
      </header>
      <div class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div class="max-w-[1200px] mx-auto flex flex-col gap-8">
          {/* <!-- Profile Header Section --> */}
          <div class="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <div class="flex gap-5 items-center">
              <div class="size-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border-light dark:border-border-dark flex items-center justify-center p-2 relative shrink-0">
                <div
                  class="w-full h-full bg-contain bg-no-repeat bg-center"
                  data-alt="Company Logo TechStart"
                //   style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0vXjvFBOjdlY6BLwKCDvmn-LpikyPc_6Y_WZk_49eP7ParBXGPsjRtONcjsbgAJ44rTUE6HloUHYxACoghyKnFEst8whD4jtj7mGSa1oyQ5e4Q0PkIQSgothimI8Ptmwz1xfkc93VZNg1xNxGaB1Iz3bgPedJbKAuXhZGJmloSMf0-54KHgOsbH7kEr0fHL3Sg2lARYktLuwG_bWN9F99AysKmEV1aZ5thaCUnoHxRShtGhZmbGSKSSY2u8XGiiqkxJM2ILPdFd0');"
                ></div>
                <div
                  class="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-surface-dark"
                  title="Verified Manufacturer"
                >
                  <span class="material-symbols-outlined text-[16px] block">
                    verified
                  </span>
                </div>
              </div>
              <div>
                <h2 class="text-2xl font-bold tracking-tight">
                  TechStart Industries
                </h2>
                <p class="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 text-sm">
                  <span class="material-symbols-outlined text-base">
                    location_on
                  </span>
                  San Francisco, CA • Verified Manufacturer
                </p>
              </div>
            </div>
            
          </div>
          {/* <!-- Stats Grid --> */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* <!-- Stat Card 1 --> */}
            <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-1">
              <div class="flex justify-between items-start mb-2">
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Total Products
                </p>
                <span class="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-xl">
                  inventory_2
                </span>
              </div>
              <p class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                12
              </p>
              <p class="text-emerald-600 text-xs font-medium mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">
                  trending_up
                </span>{" "}
                +2 this month
              </p>
            </div>
            {/* <!-- Stat Card 2 --> */}
            <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-1">
              <div class="flex justify-between items-start mb-2">
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Total Scans
                </p>
                <span class="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-xl">
                  qr_code_scanner
                </span>
              </div>
              <p class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                1,240
              </p>
              <p class="text-emerald-600 text-xs font-medium mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">
                  trending_up
                </span>{" "}
                +12% this month
              </p>
            </div>
            {/* <!-- Stat Card 3 --> */}
            <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-1">
              <div class="flex justify-between items-start mb-2">
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Monthly Active
                </p>
                <span class="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-xl">
                  bar_chart
                </span>
              </div>
              <p class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                450
              </p>
              <p class="text-emerald-600 text-xs font-medium mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">
                  trending_up
                </span>{" "}
                +5% vs last month
              </p>
            </div>
            {/* <!-- Stat Card 4 --> */}
            <div class="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-1">
              <div class="flex justify-between items-start mb-2">
                <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Support Tickets
                </p>
                <span class="material-symbols-outlined text-orange-500 bg-orange-500/10 p-1.5 rounded-lg text-xl">
                  confirmation_number
                </span>
              </div>
              <p class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                2
              </p>
              <p class="text-orange-600 text-xs font-medium mt-1">
                Requires attention
              </p>
            </div>
          </div>
          {/* <!-- Main Dashboard Content Grid --> */}
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* <!-- Chart Section (Takes up 2 cols on large screens) --> */}
            <div class="xl:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-lg font-bold">QR Scan Trends</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">
                    Scan performance over last 30 days
                  </p>
                </div>
                <select class="bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg text-sm px-3 py-1.5 focus:ring-primary focus:border-primary">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              {/* <!-- Simplified Chart Visualization --> */}
              <div class="relative h-64 w-full">
                <svg
                  class="w-full h-full overflow-visible"
                  preserveaspectratio="none"
                  viewbox="0 0 500 150"
                >
                  {/* <!-- Grid lines --> */}
                  <line
                    stroke="currentColor"
                    stroke-opacity="0.1"
                    stroke-width="1"
                    x1="0"
                    x2="500"
                    y1="150"
                    y2="150"
                  ></line>
                  <line
                    stroke="currentColor"
                    stroke-dasharray="4"
                    stroke-opacity="0.1"
                    stroke-width="1"
                    x1="0"
                    x2="500"
                    y1="100"
                    y2="100"
                  ></line>
                  <line
                    stroke="currentColor"
                    stroke-dasharray="4"
                    stroke-opacity="0.1"
                    stroke-width="1"
                    x1="0"
                    x2="500"
                    y1="50"
                    y2="50"
                  ></line>
                  {/* <!-- Chart Path --> */}
                  <defs>
                    <lineargradient
                      id="chartGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stop-color="#137fec"
                        stop-opacity="0.2"
                      ></stop>
                      <stop
                        offset="100%"
                        stop-color="#137fec"
                        stop-opacity="0"
                      ></stop>
                    </lineargradient>
                  </defs>
                  <path
                    d="M0 120 C 50 120, 50 60, 100 60 C 150 60, 150 90, 200 80 C 250 70, 250 40, 300 40 C 350 40, 350 90, 400 70 C 450 50, 450 20, 500 20 L 500 150 L 0 150 Z"
                    fill="url(#chartGradient)"
                  ></path>
                  <path
                    d="M0 120 C 50 120, 50 60, 100 60 C 150 60, 150 90, 200 80 C 250 70, 250 40, 300 40 C 350 40, 350 90, 400 70 C 450 50, 450 20, 500 20"
                    fill="none"
                    stroke="#137fec"
                    stroke-linecap="round"
                    stroke-width="3"
                  ></path>
                </svg>
                {/* <!-- X Axis Labels --> */}
                <div class="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>
            {/* <!-- Quick Actions & Support --> */}
            <div class="flex flex-col gap-6">
              {/* <!-- Quick Actions --> */}
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-6">
                <h3 class="text-lg font-bold mb-4">Quick Actions</h3>
                <div class="flex flex-col gap-3">
                  <button class="flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                    <div class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <span class="material-symbols-outlined text-lg">
                        add_photo_alternate
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold">
                        Update Product Images
                      </span>
                      <span class="text-xs text-slate-500">
                        Refresh your catalog visuals
                      </span>
                    </div>
                  </button>
                  <button class="flex items-center gap-3 p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                    <div class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <span class="material-symbols-outlined text-lg">
                        download
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold">
                        Download QR Batch
                      </span>
                      <span class="text-xs text-slate-500">
                        Get codes for printing
                      </span>
                    </div>
                  </button>
                </div>
              </div>
              {/* <!-- Support Widget --> */}
              <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
                <div class="relative z-10">
                  <div class="size-10 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                    <span class="material-symbols-outlined text-white">
                      support_agent
                    </span>
                  </div>
                  <h3 class="text-lg font-bold mb-1">Need Help?</h3>
                  <p class="text-sm text-slate-300 mb-4 leading-relaxed">
                    Contact our support team for assistance with product
                    onboarding.
                  </p>
                  <button class="w-full py-2 px-4 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
                    Open Ticket
                  </button>
                </div>
                <div class="absolute top-0 right-0 size-32 bg-primary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              </div>
            </div>
          </div>
          {/* <!-- Recent Products Table --> */}
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
            <div class="p-6 border-b border-border-light dark:border-border-dark flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 class="text-lg font-bold">Recent Products</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  Manage your latest added items
                </p>
              </div>
              <a
                class="text-primary text-sm font-semibold hover:underline"
                href="#"
              >
                View All Products
              </a>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-background-light dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
                  <tr>
                    <th class="px-6 py-4">Product Name</th>
                    <th class="px-6 py-4">SKU / Model</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4">Total Scans</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                  {/* <!-- Row 1 --> */}
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-border-light dark:border-border-dark"
                          data-alt="Smart Thermostat Product Image"
                        //   style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjGJ4Jlks_y2uG0OF2PUrqjjZ4gctrXOd8TveH0KgSyhDKHpb5_atjHTTnM-5VL1EHd7F656cj11Cc0XPaNQ3ByYY1HPvZahDuda0zVl7msj6Ap-3zka6JN_iUBUW6-jzfzdjkRsKx4r32FdOQbOtjb_-xUEXYrGel7LujKlphj1hyzXuOuC4Ns2OyIBO-ukmqM0HX0Uu1URB2d26DOlaBnNfu8EZfaZ9bwPjTdOoTNApB3EVyZQjQv3-l1dj8c8gLQsOOkBoXllw');"
                        ></div>
                        <span class="font-semibold text-slate-900 dark:text-white">
                          Smart Thermostat V2
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                      ST-2024-X
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <span class="size-1.5 rounded-full bg-emerald-500"></span>{" "}
                        Active
                      </span>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                      842
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="text-slate-400 hover:text-primary transition-colors p-1">
                        <span class="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button class="text-slate-400 hover:text-primary transition-colors p-1 ml-2">
                        <span class="material-symbols-outlined text-xl">
                          bar_chart
                        </span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 2 --> */}
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-border-light dark:border-border-dark"
                          data-alt="Industrial Fan Product Image"
                        //   style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZWfFfCYWMCVVCefZrOU-T3gUPEnqHb20WOhK4b6P2eB4c24Lul8bI84bxJx-UXEeGLubflGdWzFlz3O0h31lZlIhhVW4ftiIEtSijYVO9tYP4lxMi0aZmEPHTCXmoNYAW88c80Zof7xkWeurkjOX5cv7W-bx0WBti7OEujYo2P9AM2RvE1A2jkS95HUU4KkKGZFNeBxo8pUM49I-aiuRpmFDYHyc2bnPaHW51TtT8zE7erMWVZmcWq3ZkA151pUfmsxwaVJCboeA');"
                        ></div>
                        <span class="font-semibold text-slate-900 dark:text-white">
                          Industrial Fan X-200
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                      IND-FAN-200
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <span class="size-1.5 rounded-full bg-emerald-500"></span>{" "}
                        Active
                      </span>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                      125
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="text-slate-400 hover:text-primary transition-colors p-1">
                        <span class="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button class="text-slate-400 hover:text-primary transition-colors p-1 ml-2">
                        <span class="material-symbols-outlined text-xl">
                          bar_chart
                        </span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 3 --> */}
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-border-light dark:border-border-dark"
                          data-alt="Portable Heater Product Image"
                        //   style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDIvHQEiuFZkZ7bjskL8fMcXs8SZsZ2dntmKkYmDkUe86ppSdy0AT7a9YgWWzMQrDkHuA7DqUINoc_536X608WuM_H_-hx-urlWN308jQU8U79ObfuQNHzqrQUoIW1v1CqGdmqdrSVFmOV-jbyLh0XP6cug_IVX8DalszopT40n58HUbNcP5WGczoWeysCfn2nRxq_ALJkn_d2C8AmKrqllq1nNqDUty6QrCBxmVZryHfpGh0Mp47m2rJl8a1VGJNgeqmkP1TyX-ZI');"
                        ></div>
                        <span class="font-semibold text-slate-900 dark:text-white">
                          Portable Heater Pro
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                      HTR-PRO-01
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        <span class="size-1.5 rounded-full bg-slate-500"></span>{" "}
                        Draft
                      </span>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-300">
                      -
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="text-slate-400 hover:text-primary transition-colors p-1">
                        <span class="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button class="text-slate-400 hover:text-primary transition-colors p-1 ml-2 opacity-50 cursor-not-allowed">
                        <span class="material-symbols-outlined text-xl">
                          bar_chart
                        </span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
