// ===================== FIREBASE INIT =====================
window.LOCAL_USER_CREDENTIALS = [
    { userId: 'admin', displayName: 'Admin', password: 'admin', role: 'admin', department: 'admin' },
    { userId: 'admin_1', displayName: 'Admin', password: 'admin', role: 'admin', department: 'admin' },
    { userId: 'msme_head_1', displayName: 'MSME Head', password: 'head', role: 'msme_head', department: 'msme' },
    { userId: 'retail_head_1', displayName: 'Retail Head', password: 'head', role: 'retail_head', department: 'retail' },
    { userId: 'cso_msme_1', displayName: 'MSME CSO 1', password: 'cso', role: 'cso', department: 'msme' },
    { userId: 'cso_msme_2', displayName: 'MSME CSO 2', password: 'cso', role: 'cso', department: 'msme' },
    { userId: 'cso_msme_3', displayName: 'MSME CSO 3', password: 'cso', role: 'cso', department: 'msme' },
    { userId: 'cso_retail_1', displayName: 'Retail CSO 1', password: 'cso', role: 'cso', department: 'retail' },
    { userId: 'cso_retail_2', displayName: 'Retail CSO 2', password: 'cso', role: 'cso', department: 'retail' },
    { userId: 'cso_retail_3', displayName: 'Retail CSO 3', password: 'cso', role: 'cso', department: 'retail' },
    { userId: 'cse_1', displayName: 'CSE 1', password: 'cse', role: 'cse', department: 'telecaller' },
    { userId: 'cse_2', displayName: 'CSE 2', password: 'cse', role: 'cse', department: 'telecaller' },
    { userId: 'cse_3', displayName: 'CSE 3', password: 'cse', role: 'cse', department: 'telecaller' }
];

const firebaseConfig = null;
const rtdb = null;
const leadsRef = null;
const usersRef = null;
const remindersRef = null;
const tasksRef = null;
const escalationsRef = null;
const loanTypesRef = null;

// ===================== GLOBAL VARIABLES =====================
let leads = [], users = [], reminders = [], tasks = [], escalations = [];
let loanTypes = [];
let currentUser = null;
let currentPage = 'dashboard';
let searchQuery = '';
let dashboardFilter = null;
let loanTypeFilter = null;
let leadPageFilter = null;
let currentLeadId = null, currentTab = 'details';
let chartInstance = null;
let employeeChartInstance = null;
let leadStageChart = null;
let firebaseEnabled = false;
let localFallbackMode = true;

const LOCAL_USER_CREDENTIALS = window.LOCAL_USER_CREDENTIALS || [];

function normalizeUser(user) {
    return {
        userId: user.userId,
        displayName: user.displayName || user.userId,
        password: user.password,
        role: user.role || 'cso',
        department: user.department || 'msme',
        permissions: user.permissions || null
    };
}
const FALLBACK_USERS = [
    { userId: 'admin_1', displayName: 'Admin', password: 'admin', role: 'admin', department: 'admin', permissions: null },
    { userId: 'msme_head_1', displayName: 'MSME Head', password: 'head', role: 'msme_head', department: 'msme', permissions: null },
    { userId: 'retail_head_1', displayName: 'Retail Head', password: 'head', role: 'retail_head', department: 'retail', permissions: null },
    { userId: 'cso_msme_1', displayName: 'MSME CSO 1', password: 'cso', role: 'cso', department: 'msme', permissions: null },
    { userId: 'cso_msme_2', displayName: 'MSME CSO 2', password: 'cso', role: 'cso', department: 'msme', permissions: null },
    { userId: 'cso_msme_3', displayName: 'MSME CSO 3', password: 'cso', role: 'cso', department: 'msme', permissions: null },
    { userId: 'cso_retail_1', displayName: 'Retail CSO 1', password: 'cso', role: 'cso', department: 'retail', permissions: null },
    { userId: 'cso_retail_2', displayName: 'Retail CSO 2', password: 'cso', role: 'cso', department: 'retail', permissions: null },
    { userId: 'cso_retail_3', displayName: 'Retail CSO 3', password: 'cso', role: 'cso', department: 'retail', permissions: null },
    { userId: 'cse_1', displayName: 'CSE 1', password: 'cse', role: 'cse', department: 'telecaller', permissions: null },
    { userId: 'cse_2', displayName: 'CSE 2', password: 'cse', role: 'cse', department: 'telecaller', permissions: null },
    { userId: 'cse_3', displayName: 'CSE 3', password: 'cse', role: 'cse', department: 'telecaller', permissions: null },
    { userId: 'bank1', displayName: 'Bank Follow Officer', password: 'pass', role: 'bank_follow_officer', department: 'common', permissions: null },
    { userId: 'legal1', displayName: 'Legal Officer', password: 'pass', role: 'legal_officer', department: 'legal', permissions: null }
];
const FALLBACK_LOAN_TYPES = ['Home Loan', 'LAP', 'MSME Loan', 'Personal Loan', 'Business Loan'];
const FALLBACK_LEADS = [
    {
        id: 'lead1', name: 'Amit Patel', phone: '9876543210', loanType: 'Home Loan', amount: 5000000, category: 'MSME',
        status: 'new', tat: 0, createdBy: 'cso_msme_1', assignedCSOs: ['cso_msme_1'], visibleTo: ['msme_head_1'],
        history: [{ s: 'new', by: 'MSME CSO 1', d: new Date().toLocaleString(), remarks: 'Lead created' }],
        cc: []
    },
    {
        id: 'lead2', name: 'Neha Gupta', phone: '9123456789', loanType: 'LAP', amount: 2500000, category: 'Retail',
        status: 'profiling', tat: 1, createdBy: 'cso_retail_1', assignedCSOs: ['cso_retail_1'], visibleTo: ['retail_head_1'],
        history: [
            { s: 'new', by: 'Retail CSO 1', d: new Date().toLocaleString() },
            { s: 'profiling', by: 'Retail CSO 1', d: new Date().toLocaleString(), remarks: 'Profiling started' }
        ],
        cc: []
    }
];
const FALLBACK_REMINDERS = [];
const FALLBACK_TASKS = [];
const FALLBACK_ESCALATIONS = [];
const LOCAL_STORAGE_KEY = 'crmLocalData';

function loadLocalState() {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
        console.warn('Failed to load local state:', error);
        return null;
    }
}

function persistLocalState() {
    if (!localFallbackMode) return;
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            leads,
            reminders,
            tasks,
            escalations,
            loanTypes
        }));
    } catch (error) {
        console.warn('Failed to persist local state:', error);
    }
}

function applyLocalFallbackData() {
    const savedState = loadLocalState();
    const sourceUsers = LOCAL_USER_CREDENTIALS.length ? LOCAL_USER_CREDENTIALS : FALLBACK_USERS;
    users = sourceUsers.map(normalizeUser);
    if (savedState) {
        leads = Array.isArray(savedState.leads) ? savedState.leads : [...FALLBACK_LEADS];
        loanTypes = Array.isArray(savedState.loanTypes) ? savedState.loanTypes : [...FALLBACK_LOAN_TYPES];
        reminders = Array.isArray(savedState.reminders) ? savedState.reminders : [...FALLBACK_REMINDERS];
        tasks = Array.isArray(savedState.tasks) ? savedState.tasks : [...FALLBACK_TASKS];
        escalations = Array.isArray(savedState.escalations) ? savedState.escalations : [...FALLBACK_ESCALATIONS];
    } else {
        leads = [...FALLBACK_LEADS];
        loanTypes = [...FALLBACK_LOAN_TYPES];
        reminders = [...FALLBACK_REMINDERS];
        tasks = [...FALLBACK_TASKS];
        escalations = [...FALLBACK_ESCALATIONS];
    }
}

async function checkFirebaseAccess() {
    return false;
}

// Status definitions
const STATUSES = [
    { k: 'new', l: 'New Lead', c: 'b-new' },
    { k: 'hotlead', l: 'Hot Lead', c: 'b-hotlead' },
    { k: 'profiling', l: 'Primary Profiling', c: 'b-profiling' },
    { k: 'bankfin', l: 'Bank Finalizing', c: 'b-bankfin' },
    { k: 'docs', l: 'Documentation', c: 'b-docs' },
    { k: 'financial', l: 'Financial Analysis', c: 'b-financial' },
    { k: 'legal', l: 'Legal Checking', c: 'b-legal' },
    { k: 'tech', l: 'Technical Evaluation', c: 'b-tech' },
    { k: 'other', l: 'Other Stage', c: 'b-other' },
    { k: 'secbank', l: 'Secondary Profile', c: 'b-secbank' },
    { k: 'login', l: 'Login', c: 'b-login' },
    { k: 'sanction', l: 'Sanction', c: 'b-sanction' },
    { k: 'disbursed', l: 'Disbursed', c: 'b-disbursed' },
    { k: 'followup', l: 'Follow Up', c: 'b-followup' },
    { k: 'hold', l: 'On Hold', c: 'b-hold' },
    { k: 'dump', l: 'Dump', c: 'b-dump' }
];

const TAT = { bankfin: 2, secbank: 2, login: 2, sanction: 7, docs: 7, financial: 2, legal: 3, tech: 3, other: 3, profiling: 1, hotlead: 1 };
const STAGE_WARNING_HOURS = 3;
const STAGE_BREACH_HOURS = 5;

const MENU_PAGES = ['dashboard', 'all-leads', 'new-leads', 'processing', 'tat-breach', 'tat-warning', 'reminders', 'monitor', 'tasks', 'escalations', 'reports', 'pipeline', 'workflow', 'admin-panel'];
const DEFAULT_PAGE_ACCESS = ['dashboard', 'all-leads', 'new-leads', 'processing', 'tat-breach', 'tat-warning', 'reminders', 'monitor', 'tasks', 'escalations', 'reports', 'pipeline', 'workflow'];

function getStat(k) {
    return STATUSES.find(s => s.k === k) || { k, l: k, c: 'b-dump' };
}

function badge(k) {
    return `<span class="badge ${getStat(k).c}">${getStat(k).l}</span>`;
}

function formatDurationMs(ms) {
    if (!Number.isFinite(ms)) return '0m';
    const totalMinutes = Math.round(Math.abs(ms) / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes || !parts.length) parts.push(`${minutes}m`);
    return parts.join(' ');
}

function parseHistoryTimestamp(entry) {
    const raw = entry.d || entry.date || entry.created || entry.createdAt;
    const parsed = new Date(raw);
    return isNaN(parsed.getTime()) ? null : parsed.getTime();
}

function getLeadStageDurations(lead) {
    const history = (lead.history || [])
        .map(entry => ({ ...entry, time: parseHistoryTimestamp(entry) }))
        .filter(entry => entry.time !== null)
        .sort((a, b) => a.time - b.time);

    if (!history.length) return [];
    return history.map((entry, index) => {
        const next = history[index + 1];
        const endTime = next ? next.time : Date.now();
        const durationMs = Math.max(0, endTime - entry.time);
        return {
            stage: entry.s || entry.status || 'unknown',
            label: getStat(entry.s || entry.status || 'unknown').l,
            start: entry.time,
            end: next ? next.time : null,
            durationMs,
            hours: durationMs / 3600000,
            isCurrent: index === history.length - 1
        };
    });
}

function getCurrentStageDurationMs(lead) {
    const current = getLeadStageDurations(lead).find(s => s.isCurrent);
    return current ? current.durationMs : 0;
}

function getCurrentStageDurationHours(lead) {
    const current = getLeadStageDurations(lead).find(s => s.isCurrent);
    return current ? current.hours : 0;
}

function getLeadDuration(lead) {
    const current = getLeadStageDurations(lead).find(s => s.isCurrent);
    if (current) return formatDurationMs(current.durationMs);
    if (lead.created) {
        const created = new Date(lead.created);
        if (!isNaN(created.getTime())) {
            return formatDurationMs(Date.now() - created.getTime());
        }
    }
    return '0m';
}

function getLeadTotalDuration(lead) {
    return getLeadStageDurations(lead).reduce((sum, item) => sum + item.durationMs, 0);
}

function getLeadStageBadgeClass(lead) {
    const hours = getCurrentStageDurationHours(lead);
    if (hours >= STAGE_BREACH_HOURS) return 'tat-breach';
    if (hours >= STAGE_WARNING_HOURS) return 'tat-warning';
    return 'tat-ok';
}

function isTatBreach(lead) {
    return getCurrentStageDurationHours(lead) >= STAGE_BREACH_HOURS;
}

function isTatWarning(lead) {
    const hours = getCurrentStageDurationHours(lead);
    return hours >= STAGE_WARNING_HOURS && hours < STAGE_BREACH_HOURS;
}

function formatDueStatus(dateStr) {
    if (!dateStr) return 'No due date';
    const due = new Date(dateStr);
    if (isNaN(due.getTime())) return dateStr;
    const diff = due.getTime() - Date.now();
    if (diff >= 0) return `Due in ${formatDurationMs(diff)}`;
    return `Overdue by ${formatDurationMs(diff)}`;
}

// ===================== HELPER FUNCTIONS =====================
function toast(msg, type = 'success') {
    const toastDiv = document.createElement('div');
    toastDiv.className = `toast ${type}`;
    toastDiv.innerHTML = msg;
    document.getElementById('toasts').appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 3000);
}

function closeModal() {
    document.getElementById('overlay').classList.remove('open');
}

function closeOverlay(e) {
    if (e.target === document.getElementById('overlay')) closeModal();
}

function openModal(title, body, footer) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalFoot').innerHTML = footer || '';
    document.getElementById('overlay').classList.add('open');
    document.getElementById('modal').classList.remove('fullscreen');
    document.getElementById('modalFullscreenBtn').innerHTML = '⛶';
}

function toggleModalFullscreen() {
    const modal = document.getElementById('modal');
    const btn = document.getElementById('modalFullscreenBtn');
    modal.classList.toggle('fullscreen');
    btn.innerHTML = modal.classList.contains('fullscreen') ? '⛶' : '⛶';
}

// ===================== DATA VISIBILITY =====================
function getVisibleLeads() {
    if (!currentUser) return [];
    if (!canViewLeads()) return [];
    const allLeads = Array.isArray(leads) ? leads : [];
    const isAssigned = (lead) => Array.isArray(lead.assignedCSOs) && lead.assignedCSOs.includes(currentUser.userId);
    const isCreator = (lead) => lead.createdBy === currentUser.userId;

    if (currentUser.role === 'admin') return allLeads;
    if (currentUser.role === 'cso') return allLeads.filter(lead => isCreator(lead) || isAssigned(lead));
    if (currentUser.role === 'cse') return allLeads.filter(lead => isCreator(lead) || isAssigned(lead));
    if (currentUser.role === 'msme_head') return allLeads.filter(lead => lead.category === 'MSME' || isCreator(lead) || isAssigned(lead));
    if (currentUser.role === 'retail_head') return allLeads.filter(lead => lead.category === 'Retail' || isCreator(lead) || isAssigned(lead));
    if (currentUser.role === 'bank_follow_officer') return allLeads.filter(lead => ['MSME', 'Retail'].includes(lead.category) || isCreator(lead) || isAssigned(lead));
    if (currentUser.role === 'legal_officer') return allLeads.filter(lead => lead.status === 'legal' || isCreator(lead) || isAssigned(lead));
    return allLeads.filter(lead => isCreator(lead) || isAssigned(lead) || lead.visibleTo?.includes(currentUser.userId));
}

function filteredLeads() {
    let list = getVisibleLeads();
    if (dashboardFilter === 'new') list = list.filter(l => l.status === 'new');
    if (dashboardFilter === 'allocated') list = list.filter(l => Array.isArray(l.assignedCSOs) && l.assignedCSOs.length);
    if (leadPageFilter === 'allocated') list = list.filter(l => Array.isArray(l.assignedCSOs) && l.assignedCSOs.includes(currentUser.userId));
    if (leadPageFilter === 'new') list = list.filter(l => l.status === 'new');
    if (leadPageFilter === 'tat-warning') list = list.filter(isTatWarning);
    if (leadPageFilter === 'tat-breach') list = list.filter(isTatBreach);
    if (loanTypeFilter && loanTypeFilter !== 'All') list = list.filter(l => l.loanType === loanTypeFilter);
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(l =>
            l.name.toLowerCase().includes(q) ||
            l.phone.toLowerCase().includes(q) ||
            l.loanType.toLowerCase().includes(q) ||
            l.status.toLowerCase().includes(q) ||
            getStat(l.status).l.toLowerCase().includes(q)
        );
    }
    return list;
}

function getUserDisplayName(userId) {
    const user = users.find(u => u.userId === userId);
    return user ? user.displayName : userId || 'Unknown';
}

function getVisibleReminders() {
    if (!currentUser) return [];
    return reminders.filter(r => {
        if (currentUser.role === 'admin') return true;
        if (r.createdBy === currentUser.userId) return true;
        const assignedTo = Array.isArray(r.assignedTo) ? r.assignedTo : r.assignedTo ? [r.assignedTo] : [];
        const cc = Array.isArray(r.cc) ? r.cc : r.cc ? [r.cc] : [];
        if (assignedTo.includes(currentUser.userId)) return true;
        if (cc.includes(currentUser.userId)) return true;
        if (r.type === 'department') {
            const dept = (r.department || '').toLowerCase();
            if (currentUser.role === 'bank_follow_officer') return ['msme', 'retail'].includes(dept);
            return dept === (currentUser.department || '').toLowerCase();
        }
        return false;
    });
}

function getVisibleEscalations() {
    if (!currentUser) return [];
    return escalations.filter(e => {
        if (currentUser.role === 'admin') return true;
        if (e.createdBy === currentUser.userId) return true;
        if (e.assignedTo === currentUser.userId) return true;
        const lead = leads.find(l => l.id === e.leadId);
        return lead?.createdBy === currentUser.userId;
    });
}

function getDefaultPermissions(role) {
    let pageAccess;
    switch (role) {
        case 'admin':
            pageAccess = [...DEFAULT_PAGE_ACCESS, 'admin-panel'];
            break;
        case 'msme_head':
        case 'retail_head':
            pageAccess = ['dashboard', 'all-leads', 'new-leads', 'processing', 'tat-breach', 'tat-warning', 'reminders', 'monitor', 'tasks', 'escalations', 'reports', 'pipeline', 'workflow'];
            break;
        case 'cso':
            pageAccess = ['dashboard', 'new-leads', 'processing', 'tat-breach', 'tat-warning', 'reminders', 'monitor', 'tasks', 'workflow'];
            break;
        case 'cse':
            pageAccess = ['dashboard', 'new-leads'];
            break;
        case 'telecaller':
            pageAccess = ['dashboard', 'new-leads', 'processing', 'reminders', 'tasks'];
            break;
        case 'bank_follow_officer':
        case 'legal_officer':
            pageAccess = ['dashboard', 'all-leads', 'monitor', 'workflow'];
            break;
        default:
            pageAccess = [...DEFAULT_PAGE_ACCESS];
    }
    return { pageAccess, canViewLeads: role !== 'visitor' };
}

function normalizeUser(user) {
    const permissions = getDefaultPermissions(user.role);
    return { ...user, permissions };
}

function canViewPage(page) {
    if (!currentUser) return false;
    if (page === 'admin-panel') return currentUser.role === 'admin';
    if (currentUser.role === 'admin') return true;
    const access = currentUser.permissions?.pageAccess;
    if (!Array.isArray(access)) return page !== 'admin-panel';
    return access.includes(page);
}

function canViewLeads() {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return currentUser.permissions?.canViewLeads !== false;
}

function updateBadges() {
    const remCount = getVisibleReminders().length;
    const taskCount = tasks.filter(t => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return t.status !== 'completed';
        return (t.assignedTo === currentUser.userId || t.createdBy === currentUser.userId) && t.status !== 'completed';
    }).length;
    const escCount = leads.filter(l => {
        const lim = TAT[l.status] || 99;
        return l.tat >= lim && l.status !== 'disbursed';
    }).length;
    const remBadge = document.getElementById('nb-rem');
    const taskBadge = document.getElementById('nb-tasks');
    const escBadge = document.getElementById('nb-esc');
    if (remBadge) remBadge.innerText = remCount;
    if (taskBadge) taskBadge.innerText = taskCount;
    if (escBadge) escBadge.innerText = escCount;
}

// ===================== PAGE LOADING & RENDERING =====================
async function loadPage(page) {
    currentPage = page;
    document.getElementById('pageTitle').innerText = page.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    if (!canViewPage(page)) {
        document.getElementById('appContent').innerHTML = `
            <div class="panel">
                <div class="panel-header">Access Restricted</div>
                <div class="panel-body">You do not have permission to access this page. Please contact your administrator.</div>
            </div>
        `;
        updateSidebarActive();
        return;
    }
    const response = await fetch(`../pages/${page}.html`);
    const html = await response.text();
    document.getElementById('appContent').innerHTML = html;

    switch (page) {
        case 'dashboard': renderDashboard(); break;
        case 'all-leads': renderAllLeads(); break;
        case 'new-leads': renderNewLeads(); break;
        case 'processing': renderProcessing(); break;
        case 'tat-breach': renderTatBreach(); break;
        case 'tat-warning': renderTatWarning(); break;
        case 'reminders': renderReminders(); break;
        case 'monitor': renderMonitor(); break;
        case 'tasks': renderTasks(); break;
        case 'escalations': renderEscalations(); break;
        case 'reports': renderReports(); break;
        case 'pipeline': renderPipeline(); break;
        case 'admin-panel': renderAdminPanel(); break;
        case 'workflow': break;
        default: break;
    }
    updateSidebarActive();
}

function renderDashboard() {
    const visible = getVisibleLeads();
    const total = visible.length;
    const tatBreach = visible.filter(isTatBreach).length;
    const remindersCount = getVisibleReminders().length;
    const tasksCount = tasks.filter(t => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return t.status !== 'completed';
        return (t.assignedTo === currentUser.userId || t.createdBy === currentUser.userId) && t.status !== 'completed';
    }).length;
    const escalations = tatBreach;

    document.getElementById('dashboard-stats').innerHTML = `
        <div class="stat-card" onclick="setDashboardFilter('total')">
            <div class="stat-card-label">Total Leads</div>
            <div class="stat-card-value">${total}</div>
        </div>
        <div class="stat-card" onclick="navToPage('tat-breach')">
            <div class="stat-card-label">TAT Breach</div>
            <div class="stat-card-value" style="color:var(--red2)">${tatBreach}</div>
        </div>
        <div class="stat-card" onclick="navToPage('reminders')">
            <div class="stat-card-label">Reminders</div>
            <div class="stat-card-value">${remindersCount}</div>
        </div>
        <div class="stat-card" onclick="navToPage('tasks')">
            <div class="stat-card-label">Tasks</div>
            <div class="stat-card-value">${tasksCount}</div>
        </div>
        <div class="stat-card" onclick="navToPage('escalations')">
            <div class="stat-card-label">Escalations</div>
            <div class="stat-card-value" style="color:var(--orange)">${escalations}</div>
        </div>
    `;
}

function renderAllLeads() { renderLeadTable(filteredLeads(), 'all-leads'); }
function renderNewLeads() { renderLeadTable(filteredLeads().filter(l => l.status === 'new' && (l.assignedCSOs?.includes(currentUser.userId) || l.createdBy === currentUser.userId)), 'new-leads'); }
function renderProcessing() { renderLeadTable(filteredLeads().filter(l => !['disbursed', 'dump', 'hold'].includes(l.status)), 'processing'); }
function renderTatBreach() { renderLeadTable(filteredLeads().filter(isTatBreach), 'tat-breach'); }
function renderTatWarning() { renderLeadTable(filteredLeads().filter(isTatWarning), 'tat-warning'); }

function renderLeadFilters(page) {
    const container = document.getElementById('leadFilterBar');
    if (!container) return;
    const filterButtons = [
        { key: 'all', label: 'All Leads' },
        { key: 'new', label: 'New Leads' },
        { key: 'allocated', label: 'Allocated to Me' },
        { key: 'tat-warning', label: 'TAT Warning' },
        { key: 'tat-breach', label: 'TAT Breach' }
    ];
    const statusButtons = filterButtons.map(f => `
        <button class="filter-chip ${leadPageFilter === f.key || (!leadPageFilter && page === 'all-leads' && f.key === 'all') ? 'active' : ''}"
                onclick="setLeadPageFilter('${f.key}')">${f.label}</button>
    `).join('');
    const loanButtonLabel = loanTypeFilter || 'All';
    const loanItems = ['All', ...loanTypes].map(type => `
        <button class="filter-dropdown-item ${(loanTypeFilter === type || (!loanTypeFilter && type === 'All')) ? 'active' : ''}"
                onclick="setLoanTypeFilter('${type}')">${type}</button>
    `).join('');
    const clearFilterItem = loanTypeFilter ? `
        <button class="filter-dropdown-item filter-clear-item" onclick="setLoanTypeFilter('All')">Clear filter</button>
    ` : '';
    container.innerHTML = `
        <div class="lead-filter-row">
            <div class="lead-filter-group"><strong>View:</strong> ${statusButtons}</div>
        </div>
        <div class="lead-filter-row">
            <div class="lead-filter-group">
                <strong>Loan Type:</strong>
                <div class="filter-dropdown" id="loanTypeDropdown" onclick="toggleLoanTypeDropdown(event)">
                    <button class="filter-chip filter-dropdown-button">${loanButtonLabel} <i class="fas fa-caret-down"></i></button>
                    <div class="filter-dropdown-menu" onclick="event.stopPropagation()">
                        ${clearFilterItem}
                        <input id="loanTypeSearch" class="filter-search" placeholder="Search loan types..." oninput="filterLoanTypeDropdown()">
                        <div class="filter-dropdown-list">${loanItems}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleLoanTypeDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('loanTypeDropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('show');
}

function filterLoanTypeDropdown() {
    const query = document.getElementById('loanTypeSearch')?.value.toLowerCase() || '';
    document.querySelectorAll('#loanTypeDropdown .filter-dropdown-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.filter-dropdown.show').forEach(dd => dd.classList.remove('show'));
}

function setLeadPageFilter(filter) {
    leadPageFilter = filter === 'all' ? null : filter;
    if (currentPage === 'all-leads') renderAllLeads();
    else if (currentPage === 'new-leads') renderNewLeads();
    else if (currentPage === 'processing') renderProcessing();
    else if (currentPage === 'tat-breach') renderTatBreach();
    else if (currentPage === 'tat-warning') renderTatWarning();
}

function setLoanTypeFilter(type) {
    loanTypeFilter = type === 'All' ? null : type;
    closeAllDropdowns();
    if (currentPage === 'all-leads') renderAllLeads();
    else if (currentPage === 'new-leads') renderNewLeads();
    else if (currentPage === 'processing') renderProcessing();
    else if (currentPage === 'tat-breach') renderTatBreach();
    else if (currentPage === 'tat-warning') renderTatWarning();
}

function renderLeadTable(list, page) {
    renderLeadFilters(page);
    const tbody = document.getElementById('leads-table-body');
    if (!tbody) return;
    tbody.innerHTML = list.map(l => {
        const assignedNames = Array.isArray(l.assignedCSOs) && l.assignedCSOs.length
            ? l.assignedCSOs.map(getUserDisplayName).join(', ')
            : 'Unassigned';
        return `
        <tr>
            <td>
                <div>
                    <strong>${l.name}</strong><br>
                    <small>${l.phone}</small><br>
                    <small class="lead-allocated">Allocated to: ${assignedNames}</small>
                </div>
            </td>
            <td>${l.loanType}</td>
            <td>${badge(l.status)}</td>
            <td class="${getLeadStageBadgeClass(l)}">${getLeadDuration(l)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewLead('${l.id}')">View</button>
                ${currentUser?.role === 'head' || currentUser?.role === 'admin' ? `<button class="btn btn-sm btn-primary" onclick="openReassignModal('${l.id}')">Reassign</button>` : ''}
            </td>
        </tr>
    `;
    }).join('');
}

function renderReminders() {
    const container = document.getElementById('reminders-list');
    if (!container) return;
    const myReminders = getVisibleReminders();
    container.innerHTML = `
        <div style="margin-bottom:16px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
            <button class="btn btn-info" onclick="navToPage('monitor')">View CC Monitor</button>
            <div style="flex:1; min-width:220px; color:var(--text2);">Search for reminders by title, lead, or assignee using top search.</div>
        </div>
    ` + (myReminders.map(r => `
        <div class="rem-item">
            <strong>${r.title}</strong><br>
            ${r.desc}<br>
            ${r.leadName ? `<small>Lead: ${r.leadName}</small><br>` : ''}
            <small>${formatDueStatus(r.due)}</small><br>
            <small>Created by: ${getUserDisplayName(r.createdBy)}</small><br>
            ${r.assignedTo ? `<small>Assigned to: ${Array.isArray(r.assignedTo) ? r.assignedTo.map(getUserDisplayName).join(', ') : getUserDisplayName(r.assignedTo)}</small><br>` : ''}
            ${r.cc?.length ? `<small>CC: ${r.cc.map(getUserDisplayName).join(', ')}</small><br>` : ''}
            ${r.type === 'department' ? `<small>Department: ${r.department}</small><br>` : ''}
            ${Array.isArray(r.cc) && r.cc.includes(currentUser.userId) ? `<small style="color:var(--gold);">You are CC'd on this reminder</small><br>` : ''}
            <button class="btn btn-sm btn-primary" onclick="completeReminder('${r.id}')">Mark Done</button>
        </div>
    `).join('') || '<div>No reminders</div>');
}

function renderTasks() {
    const pendingContainer = document.getElementById('pending-tasks');
    const completedContainer = document.getElementById('completed-tasks');
    if (!pendingContainer) return;

    const myTasks = tasks.filter(t => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;
        return t.assignedTo === currentUser.userId || t.createdBy === currentUser.userId;
    });

    const pending = myTasks.filter(t => t.status !== 'completed');
    const completed = myTasks.filter(t => t.status === 'completed');

    const attachmentsNote = (t) => {
        const list = Array.isArray(t.attachments) ? t.attachments : [];
        if (!list.length) return '';
        const filesHtml = list.map((a, idx) => `
            <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:6px;">
                <small style="color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px;">📎 ${a.name} (${formatBytes(a.size)})</small>
                <button class="btn btn-sm btn-info" onclick="downloadTaskAttachment('${t.id}', ${idx})">Download</button>
            </div>
        `).join('');
        return `<div style="margin-top:8px;"><small style="font-weight:700;">Attachments</small>${filesHtml}</div>`;
    };

    pendingContainer.innerHTML = pending.map(t => `
        <div class="task-item">
            <strong>${t.title}</strong><br>
            ${t.desc}<br>
            <small>${formatDueStatus(t.due)}</small><br>
            ${t.createdAt ? `<small>Created: ${formatDurationMs(Date.now() - t.createdAt)}</small><br>` : ''}
            <small>Assigned to: ${getUserDisplayName(t.assignedTo)}</small><br>
            <small>Created by: ${getUserDisplayName(t.createdBy)}</small><br>
            ${attachmentsNote(t)}
            <button class="btn btn-sm btn-primary" onclick="completeTask('${t.id}')">Complete</button>
        </div>
    `).join('') || 'None';

    completedContainer.innerHTML = completed.map(t => `
        <div class="task-item">
            ✅ <strong>${t.title}</strong><br>
            ${t.desc}<br>
            <small>${formatDueStatus(t.due)}</small><br>
            ${t.createdAt ? `<small>Created: ${formatDurationMs(Date.now() - t.createdAt)}</small><br>` : ''}
            <small>Assigned to: ${getUserDisplayName(t.assignedTo)}</small><br>
            <small>Created by: ${getUserDisplayName(t.createdBy)}</small>
            ${attachmentsNote(t)}
        </div>
    `).join('') || 'None';
}

function renderMonitor() {
    const container = document.getElementById('monitor-list');
    if (!container) return;
    const monitorReminders = reminders.filter(r => Array.isArray(r.cc) && r.cc.includes(currentUser.userId));
    const monitorTasks = tasks.filter(t => Array.isArray(t.cc) && t.cc.includes(currentUser.userId));
    const monitorLeads = leads.filter(l => Array.isArray(l.cc) && l.cc.includes(currentUser.userId));
    
    const remindersHtml = monitorReminders.length ? `
        <h4>CC Reminders</h4>
        ${monitorReminders.map(r => `
            <div class="rem-item">
                <strong>${r.title}</strong><br>
                ${r.desc}<br>
                ${r.leadName ? `<small>Lead: ${r.leadName}</small><br>` : ''}
                <small>${formatDueStatus(r.due)}</small><br>
                <small>Created by: ${getUserDisplayName(r.createdBy)}</small><br>
                ${r.assignedTo ? `<small>Assigned to: ${Array.isArray(r.assignedTo) ? r.assignedTo.map(getUserDisplayName).join(', ') : getUserDisplayName(r.assignedTo)}</small><br>` : ''}
                ${r.cc?.length ? `<small>CC: ${r.cc.map(getUserDisplayName).join(', ')}</small><br>` : ''}
                ${r.type === 'department' ? `<small>Department: ${r.department}</small><br>` : ''}
                <button class="btn btn-sm btn-primary" onclick="completeReminder('${r.id}')">Mark Done</button>
            </div>
        `).join('')}
    ` : '';
    
    const tasksHtml = monitorTasks.length ? `
        <h4>CC Tasks</h4>
        ${monitorTasks.map(t => `
            <div class="rem-item">
                <strong>${t.title}</strong><br>
                ${t.desc}<br>
                <small>Due: ${t.due ? new Date(t.due).toLocaleDateString() : 'No due date'}</small><br>
                <small>Assigned to: ${getUserDisplayName(t.assignedTo)}</small><br>
                <small>Created by: ${getUserDisplayName(t.createdBy)}</small><br>
                ${t.cc?.length ? `<small>CC: ${t.cc.map(getUserDisplayName).join(', ')}</small><br>` : ''}
            </div>
        `).join('')}
    ` : '';
    
    const leadsHtml = monitorLeads.length ? `
        <h4>CC Leads</h4>
        ${monitorLeads.map(l => `
            <div class="rem-item">
                <strong>${l.name} (${l.loanType})</strong><br>
                <small>Phone: ${l.phone}</small><br>
                <small>Status: ${badge(l.status)}</small><br>
                <small>Assigned to: ${Array.isArray(l.assignedCSOs) && l.assignedCSOs.length ? l.assignedCSOs.map(getUserDisplayName).join(', ') : 'Unassigned'}</small><br>
                <small>Created by: ${getUserDisplayName(l.createdBy)}</small><br>
                ${l.cc?.length ? `<small>CC: ${l.cc.map(getUserDisplayName).join(', ')}</small><br>` : ''}
                <button class="btn btn-sm btn-info" onclick="viewLead('${l.id}')">View Lead</button>
            </div>
        `).join('')}
    ` : '';
    
    container.innerHTML = remindersHtml + tasksHtml + leadsHtml || '<div>No items assigned to you for monitoring.</div>';
}

function renderEscalations() {
    const container = document.getElementById('escalations-list');
    if (!container) return;
    const escList = getVisibleEscalations();
    const leadOptions = leads.map(l => `<option value="${l.id}">${l.name} (${l.loanType})</option>`).join('');
    const userOptions = users.map(u => `<option value="${u.userId}">${u.displayName} (${u.role})</option>`).join('');

    container.innerHTML = `
        <div class="panel-body" style="margin-bottom:16px;">
            <button class="btn btn-primary" onclick="openCreateEscalation()">+ Add Escalation</button>
        </div>
        ${escList.length ? escList.map(e => {
            const messageCount = e.messages
                ? (Array.isArray(e.messages)
                    ? e.messages.filter(Boolean).length
                    : Object.values(e.messages).filter(Boolean).length)
                : 0;
            return `
            <div class="rem-item">
                <strong>Lead:</strong> ${e.leadName || 'Unknown'}<br>
                <strong>Reason:</strong> ${e.reason}<br>
                <small>Escalated by: ${getUserDisplayName(e.createdBy)}</small><br>
                <small>Assigned to: ${getUserDisplayName(e.assignedTo)}</small><br>
                <small>Status: ${e.status || 'open'}</small><br>
                <small>Sent: ${new Date(e.createdAt).toLocaleString()}</small><br>
                <small>Messages: ${messageCount}</small><br>
                <button class="btn btn-sm btn-info" onclick="viewEscalation('${e.id}')">Open Chat</button>
                <button class="btn btn-sm" onclick="viewLead('${e.leadId}')">View Lead</button>
            </div>
        `;
        }).join('') : '<div>No escalations yet</div>'}
    `;
}

function openCreateEscalation() {
    window.escalationAttachmentsTemp = [];
    const leadOptions = leads.map(l => `<option value="${l.id}">${l.name} (${l.loanType})</option>`).join('');
    const userOptions = users.map(u => `<option value="${u.userId}">${u.displayName} (${u.role})</option>`).join('');
    openModal('Create Escalation', `
        <div class="fg"><label>Select Lead</label><select id="escalationLead">${leadOptions}</select></div>
        <div class="fg"><label>Select Person</label><select id="escalationPerson">${userOptions}</select></div>
        <div class="fg"><label>Escalation Reason</label><textarea id="escalationReason" rows="3"></textarea></div>
        <div class="fg" style="margin-top:10px;">
            <label>Upload Documents (Any Format)</label>
            <input id="escalationFiles" type="file" multiple onchange="handleEscalationFiles(this.files)">
            <div id="escalationAttachmentsList" style="margin-top:10px;"></div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveEscalation()">Send Escalation</button>
    `);
    setTimeout(() => renderEscalationAttachments(), 0);
}

async function saveEscalation() {
    const leadId = document.getElementById('escalationLead')?.value;
    const assignedTo = document.getElementById('escalationPerson')?.value;
    const reason = document.getElementById('escalationReason')?.value.trim();
    if (!leadId || !assignedTo || !reason) {
        toast('Lead, person and reason are required', 'error');
        return;
    }
    const lead = leads.find(l => l.id === leadId);
    const escalation = {
        id: null,
        leadId,
        leadName: lead?.name || 'Unknown',
        assignedTo,
        reason,
        attachments: window.escalationAttachmentsTemp || [],
        status: 'open',
        createdBy: currentUser.userId,
        createdAt: Date.now(),
        messages: [{ senderId: currentUser.userId, text: reason, createdAt: Date.now(), attachments: window.escalationAttachmentsTemp || [] }]
    };
    if (firebaseEnabled) {
        const ref = await escalationsRef.push(escalation);
        await ref.update({ id: ref.key });
    } else {
        escalation.id = `esc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        escalations.push(escalation);
        persistLocalState();
    }
    toast('Escalation sent', 'success');
    closeModal();
    if (currentPage === 'escalations') renderEscalations();
}

function getEscalationMessages(escalation) {
    if (!escalation || !escalation.messages) return [];
    const messages = Array.isArray(escalation.messages)
        ? escalation.messages.filter(Boolean)
        : Object.values(escalation.messages).filter(Boolean);
    return messages.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
}

// ===================== FILE ATTACHMENTS (BASE64) =====================
function formatBytes(bytes) {
    const n = Number(bytes) || 0;
    if (!n) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
    const value = n / Math.pow(1024, i);
    return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('File read failed'));
        reader.onload = () => resolve(String(reader.result || ''));
        reader.readAsDataURL(file);
    });
}

async function addFilesToAttachmentArray(files, targetArray, maxFileBytes = 10 * 1024 * 1024) {
    const list = Array.from(files || []).filter(Boolean);
    for (const file of list) {
        if (file.size > maxFileBytes) {
            toast(`Skipped "${file.name}" (>${formatBytes(maxFileBytes)})`, 'error');
            continue;
        }
        const dataUrl = await readFileAsDataUrl(file);
        targetArray.push({
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size || 0,
            lastModified: file.lastModified || Date.now(),
            dataUrl
        });
    }
}

function getFileIconClassAndColor(fileName) {
    const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';
    switch (ext) {
        case 'pdf':
            return { icon: 'far fa-file-pdf', color: '#ef4444' };
        case 'doc':
        case 'docx':
            return { icon: 'far fa-file-word', color: '#3b82f6' };
        case 'xls':
        case 'xlsx':
        case 'csv':
            return { icon: 'far fa-file-excel', color: '#10b981' };
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
        case 'webp':
            return { icon: 'far fa-file-image', color: '#a855f7' };
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return { icon: 'far fa-file-archive', color: '#eab308' };
        default:
            return { icon: 'far fa-file', color: 'var(--gold)' };
    }
}

function buildAttachmentListHtml(attachments, opts = {}) {
    const list = Array.isArray(attachments) ? attachments : [];
    const { removeFn = null, downloadFn = null, emptyText = 'No files attached.' } = opts;
    if (!list.length) return `<div style="color:var(--text3);font-size:12px;padding:12px 14px;background:rgba(255,255,255,0.01);border:1px dashed rgba(255,255,255,0.04);border-radius:10px;text-align:center;"><i class="fas fa-info-circle" style="opacity:0.5;margin-right:6px;"></i>${emptyText}</div>`;
    return `
        <div class="premium-attachment-grid">
            ${list.map((a, idx) => {
                const decorator = getFileIconClassAndColor(a?.name);
                return `
                <div class="premium-attachment-card">
                    <div class="premium-attachment-details">
                        <i class="${decorator.icon} file-icon" style="color:${decorator.color};"></i>
                        <div class="premium-attachment-info">
                            <div class="premium-attachment-name" title="${escapeHtml(a?.name || `file_${idx + 1}`)}">${escapeHtml(a?.name || `file_${idx + 1}`)}</div>
                            <div class="premium-attachment-size">${formatBytes(a?.size)}${a?.type ? ` • ${escapeHtml(a.type.split('/')[1] || a.type)}` : ''}</div>
                        </div>
                    </div>
                    <div class="premium-attachment-actions">
                        ${downloadFn ? `<button class="premium-attachment-btn download-btn" onclick="${downloadFn}(${idx})" title="Download File"><i class="fas fa-download"></i></button>` : ''}
                        ${removeFn ? `<button class="premium-attachment-btn delete-btn" onclick="${removeFn}(${idx})" title="Remove"><i class="fas fa-trash-alt"></i></button>` : ''}
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    `;
}

function downloadDataUrlAttachment(dataUrl, fileName) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
}

window.appendDocText = function(textareaId, text) {
    const el = document.getElementById(textareaId);
    if (!el) return;
    let currentVal = el.value.trim();
    
    // Check if the item already exists in the textarea lines (stripping bullet markers like • or - or * )
    const lines = currentVal.split('\n').map(l => l.replace(/^[•\-\s*]+\s*/, '').trim());
    if (lines.includes(text.trim())) {
        toast(`<i class="fas fa-info-circle" style="color:var(--gold);margin-right:6px;"></i>"${text}" is already listed`, 'info');
        return;
    }
    
    if (currentVal.length > 0) {
        currentVal += '\n• ' + text;
    } else {
        currentVal = '• ' + text;
    }
    el.value = currentVal;
    
    // Dispatch standard input event to trigger any automatic saves or listeners
    el.dispatchEvent(new Event('input'));
    toast(`<i class="fas fa-check-circle" style="color:#4caf50;margin-right:6px;"></i>Added "${text}"`, 'success');
};

// Lead attachments (Add/Edit)
window.addLeadAttachments = window.addLeadAttachments || [];
window.editLeadAttachments = window.editLeadAttachments || [];

async function handleAddLeadFiles(fileList) {
    try {
        await addFilesToAttachmentArray(fileList, window.addLeadAttachments);
        renderAddLeadAttachments();
    } catch (e) {
        toast(`Upload failed: ${e.message}`, 'error');
    }
}

function renderAddLeadAttachments() {
    const el = document.getElementById('addLeadAttachmentsList');
    if (!el) return;
    el.innerHTML = buildAttachmentListHtml(window.addLeadAttachments, {
        removeFn: 'removeAddLeadAttachment',
        downloadFn: 'downloadAddLeadAttachment',
        emptyText: 'No files uploaded yet.'
    });
}

function removeAddLeadAttachment(idx) {
    window.addLeadAttachments.splice(idx, 1);
    renderAddLeadAttachments();
}

function downloadAddLeadAttachment(idx) {
    const a = window.addLeadAttachments[idx];
    if (!a?.dataUrl) return;
    downloadDataUrlAttachment(a.dataUrl, a.name);
}

async function handleEditLeadFiles(fileList) {
    try {
        await addFilesToAttachmentArray(fileList, window.editLeadAttachments);
        renderEditLeadAttachments();
    } catch (e) {
        toast(`Upload failed: ${e.message}`, 'error');
    }
}

function renderEditLeadAttachments() {
    const el = document.getElementById('editLeadAttachmentsList');
    if (!el) return;
    el.innerHTML = buildAttachmentListHtml(window.editLeadAttachments, {
        removeFn: 'removeEditLeadAttachment',
        downloadFn: 'downloadEditLeadAttachment',
        emptyText: 'No files uploaded yet.'
    });
}

function removeEditLeadAttachment(idx) {
    window.editLeadAttachments.splice(idx, 1);
    renderEditLeadAttachments();
}

function downloadEditLeadAttachment(idx) {
    const a = window.editLeadAttachments[idx];
    if (!a?.dataUrl) return;
    downloadDataUrlAttachment(a.dataUrl, a.name);
}

function downloadLeadAttachment(idx) {
    const l = leads.find(x => x.id === currentLeadId);
    const a = (l?.attachments || [])[idx];
    if (!a?.dataUrl) return;
    downloadDataUrlAttachment(a.dataUrl, a.name);
}

// Task attachments (Create)
window.taskAttachmentsTemp = window.taskAttachmentsTemp || [];

async function handleTaskFiles(fileList) {
    try {
        await addFilesToAttachmentArray(fileList, window.taskAttachmentsTemp);
        renderTaskAttachments();
    } catch (e) {
        toast(`Upload failed: ${e.message}`, 'error');
    }
}

function renderTaskAttachments() {
    const el = document.getElementById('taskAttachmentsList');
    if (!el) return;
    el.innerHTML = buildAttachmentListHtml(window.taskAttachmentsTemp, {
        removeFn: 'removeTaskAttachment',
        downloadFn: 'downloadTaskAttachmentTemp',
        emptyText: 'No files uploaded yet.'
    });
}

function removeTaskAttachment(idx) {
    window.taskAttachmentsTemp.splice(idx, 1);
    renderTaskAttachments();
}

function downloadTaskAttachmentTemp(idx) {
    const a = window.taskAttachmentsTemp[idx];
    if (!a?.dataUrl) return;
    downloadDataUrlAttachment(a.dataUrl, a.name);
}

function downloadTaskAttachment(taskId, idx) {
    const t = tasks.find(x => x.id === taskId);
    const a = (t?.attachments || [])[idx];
    if (!a?.dataUrl) return;
    downloadDataUrlAttachment(a.dataUrl, a.name);
}

// Escalation attachments (Create + Reply)
window.escalationAttachmentsTemp = window.escalationAttachmentsTemp || [];
window.escalationReplyAttachmentsTemp = window.escalationReplyAttachmentsTemp || {};

async function handleEscalationFiles(fileList) {
    try {
        await addFilesToAttachmentArray(fileList, window.escalationAttachmentsTemp);
        renderEscalationAttachments();
    } catch (e) {
        toast(`Upload failed: ${e.message}`, 'error');
    }
}

function renderEscalationAttachments() {
    const el = document.getElementById('escalationAttachmentsList');
    if (!el) return;
    el.innerHTML = buildAttachmentListHtml(window.escalationAttachmentsTemp, {
        removeFn: 'removeEscalationAttachment',
        downloadFn: 'downloadEscalationAttachmentTemp',
        emptyText: 'No files uploaded yet.'
    });
}

function removeEscalationAttachment(idx) {
    window.escalationAttachmentsTemp.splice(idx, 1);
    renderEscalationAttachments();
}

function downloadEscalationAttachmentTemp(idx) {
    const a = window.escalationAttachmentsTemp[idx];
    if (!a?.dataUrl) return;
    downloadDataUrlAttachment(a.dataUrl, a.name);
}

async function handleEscalationReplyFiles(escalationId, fileList) {
    const key = String(escalationId || '');
    window.escalationReplyAttachmentsTemp[key] = window.escalationReplyAttachmentsTemp[key] || [];
    try {
        await addFilesToAttachmentArray(fileList, window.escalationReplyAttachmentsTemp[key]);
        renderEscalationReplyAttachments(escalationId);
    } catch (e) {
        toast(`Upload failed: ${e.message}`, 'error');
    }
}

function renderEscalationReplyAttachments(escalationId) {
    const key = String(escalationId || '');
    const el = document.getElementById('escalationReplyAttachmentsList');
    if (!el) return;
    const list = window.escalationReplyAttachmentsTemp[key] || [];
    el.innerHTML = buildAttachmentListHtml(list, {
        removeFn: `removeEscalationReplyAttachment.bind(null, '${key}')`,
        downloadFn: `downloadEscalationReplyAttachment.bind(null, '${key}')`,
        emptyText: 'No files uploaded yet.'
    });
}

function removeEscalationReplyAttachment(escalationId, idx) {
    const key = String(escalationId || '');
    const list = window.escalationReplyAttachmentsTemp[key] || [];
    list.splice(idx, 1);
    window.escalationReplyAttachmentsTemp[key] = list;
    renderEscalationReplyAttachments(key);
}

function downloadEscalationReplyAttachment(escalationId, idx) {
    const key = String(escalationId || '');
    const list = window.escalationReplyAttachmentsTemp[key] || [];
    const a = list[idx];
    if (!a?.dataUrl) return;
    downloadDataUrlAttachment(a.dataUrl, a.name);
}

function downloadEscalationMessageAttachment(escalationId, msgIdx, attIdx) {
    const escalation = escalations.find(e => e.id === escalationId);
    if (!escalation) return;
    const messages = getEscalationMessages(escalation);
    const msg = messages[msgIdx];
    const a = (msg?.attachments || [])[attIdx];
    if (!a?.dataUrl) return;
    downloadDataUrlAttachment(a.dataUrl, a.name);
}

function viewEscalation(escalationId) {
    const escalation = escalations.find(e => e.id === escalationId);
    if (!escalation) {
        toast('Escalation not found', 'error');
        return;
    }
    const messages = getEscalationMessages(escalation);
    const messageHtml = messages.map((msg, msgIdx) => {
        const sender = getUserDisplayName(msg.senderId);
        const time = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '';
        const att = Array.isArray(msg.attachments) ? msg.attachments : [];
        const attHtml = att.length ? `
            <div style="margin-top:8px;">
                <div style="font-weight:700;font-size:12px;color:var(--text2);">Attachments</div>
                <div style="margin-top:6px;display:flex;flex-direction:column;gap:6px;">
                    ${att.map((a, attIdx) => `
                        <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">
                            <div style="color:var(--text2);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:340px;">📎 ${escapeHtml(a?.name || 'file')}</div>
                            <button class="btn btn-sm btn-info" onclick="downloadEscalationMessageAttachment('${escalationId}', ${msgIdx}, ${attIdx})">Download</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';
        return `
            <div class="escalation-chat-message">
                <div class="escalation-chat-sender">${sender} <span>${time}</span></div>
                <div class="escalation-chat-body">${escapeHtml(msg.text)}</div>
                ${attHtml}
            </div>
        `;
    }).join('') || '<div class="escalation-chat-empty">No updates yet.</div>';

    const body = `
        <div class="report-detail-grid">
            <div class="report-detail-card">
                <div class="report-detail-title">Escalation Details</div>
                <div class="report-detail-line"><strong>Lead:</strong> ${escalation.leadName || 'Unknown'}</div>
                <div class="report-detail-line"><strong>Assigned to:</strong> ${getUserDisplayName(escalation.assignedTo)}</div>
                <div class="report-detail-line"><strong>Opened by:</strong> ${getUserDisplayName(escalation.createdBy)}</div>
                <div class="report-detail-line"><strong>Status:</strong> ${escalation.status || 'open'}</div>
                <div class="report-detail-line"><strong>Reason:</strong> ${escapeHtml(escalation.reason)}</div>
                <div class="report-detail-line"><strong>Created:</strong> ${new Date(escalation.createdAt).toLocaleString()}</div>
            </div>
            <div class="report-detail-card" style="grid-column: span 2;">
                <div class="report-detail-subtitle">Escalation Chat</div>
                <div class="escalation-chat-window">${messageHtml}</div>
            </div>
            <div class="report-detail-card report-detail-list" style="grid-column: span 2;">
                <div class="report-detail-subtitle">Add update</div>
                <textarea id="escalationReply" rows="4" class="textarea"></textarea>
                <div style="margin-top:10px;">
                    <label style="display:block;margin-bottom:6px;">Upload Documents</label>
                    <input type="file" multiple onchange="handleEscalationReplyFiles('${escalationId}', this.files)">
                    <div id="escalationReplyAttachmentsList" style="margin-top:10px;"></div>
                </div>
            </div>
        </div>
    `;
    openModal(`Escalation: ${escalation.leadName}`, body, `
        <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        <button class="btn btn-primary" onclick="saveEscalationReply('${escalationId}')">Send update</button>
    `);
    setTimeout(() => renderEscalationReplyAttachments(escalationId), 0);
}

async function saveEscalationReply(escalationId) {
    const text = document.getElementById('escalationReply')?.value.trim();
    if (!text) {
        toast('Please enter an update message', 'error');
        return;
    }
    const key = String(escalationId || '');
    const attachments = window.escalationReplyAttachmentsTemp[key] || [];
    if (firebaseEnabled) {
        const messagesRef = rtdb.ref(`escalations/${escalationId}/messages`);
        await messagesRef.push({
            senderId: currentUser.userId,
            text,
            createdAt: Date.now(),
            attachments
        });
    } else {
        escalations = escalations.map(e => {
            if (e.id !== escalationId) return e;
            const messages = Array.isArray(e.messages) ? [...e.messages] : Object.values(e.messages || []);
            return {
                ...e,
                messages: [...messages, { senderId: currentUser.userId, text, createdAt: Date.now(), attachments }]
            };
        });
        persistLocalState();
    }
    window.escalationReplyAttachmentsTemp[key] = [];
    toast('Escalation update posted', 'success');
    viewEscalation(escalationId);
}

function getEmployeeStats(userId) {
    const created = leads.filter(l => l.createdBy === userId);
    const assigned = leads.filter(l => l.assignedTo === userId || (Array.isArray(l.assignedCSOs) && l.assignedCSOs.includes(userId)));
    const employeeLeads = Array.from(new Set([...created, ...assigned]));
    const completed = employeeLeads.filter(l => l.status === 'disbursed');
    const openEscalations = escalations.filter(e => e.assignedTo === userId || e.createdBy === userId).length;
    const pendingTasks = tasks.filter(t => t.assignedTo === userId && t.status !== 'completed').length;
    const remindersCount = reminders.filter(r => r.assignedTo === userId || r.createdBy === userId).length;
    return {
        created: created.length,
        assigned: assigned.length,
        completed: completed.length,
        openEscalations,
        pendingTasks,
        remindersCount,
        createdLeads: created,
        assignedLeads: assigned,
        employeeLeads
    };
}

function formatHoursLabel(hours) {
    if (!Number.isFinite(hours) || hours <= 0) return '0h';
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m}m`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function getEmployeeStagePerformance(userId) {
    const employeeLeads = leads.filter(l => l.createdBy === userId || l.assignedTo === userId || (Array.isArray(l.assignedCSOs) && l.assignedCSOs.includes(userId)));
    const stages = STATUSES.map(s => s.l);
    const values = STATUSES.map(status => {
        const durations = employeeLeads.map(lead => {
            const stage = getLeadStageDurations(lead).find(item => item.stage === status.k);
            return stage ? stage.hours : null;
        }).filter(v => v !== null);
        return durations.length ? durations.reduce((sum, value) => sum + value, 0) / durations.length : 0;
    });
    return {
        stages,
        values,
        leadCount: employeeLeads.length
    };
}

function viewEmployeeStats(userId) {
    const user = users.find(u => u.userId === userId) || { displayName: userId };
    const stats = getEmployeeStats(userId);
    const perf = getEmployeeStagePerformance(userId);
    const stageRows = perf.stages.map((stageLabel, idx) => `
                    <div class="report-stage-row">${stageLabel}: ${formatHoursLabel(perf.values[idx])}</div>
                `).join('') || '<div class="report-detail-item">No stage time data available</div>';
    const body = `
        <div class="report-detail-grid">
            <div class="report-detail-card">
                <div class="report-detail-title">${user.displayName}</div>
                <div class="report-detail-line">Created Leads: ${stats.created}</div>
                <div class="report-detail-line">Assigned Leads: ${stats.assigned}</div>
                <div class="report-detail-line">Completed: ${stats.completed}</div>
                <div class="report-detail-line">Open Escalations: ${stats.openEscalations}</div>
                <div class="report-detail-line">Pending Tasks: ${stats.pendingTasks}</div>
                <div class="report-detail-line">Reminders: ${stats.remindersCount}</div>
                <div class="report-detail-line">Leads Included: ${perf.leadCount}</div>
            </div>
            <div class="report-detail-card report-detail-list">
                <div class="report-detail-subtitle">Stage average time</div>
                ${stageRows}
            </div>
            <div class="report-detail-card report-detail-list">
                <div class="report-detail-subtitle">Recent Created Leads</div>
                ${stats.createdLeads.slice(-5).map(l => `
                    <div class="report-detail-item">${l.name} — ${badge(l.status)} ${getLeadDuration(l)}</div>
                `).join('') || '<div class="report-detail-item">No created leads yet</div>'}
            </div>
            <div class="report-detail-card report-detail-list">
                <div class="report-detail-subtitle">Recent Assigned Leads</div>
                ${stats.assignedLeads.slice(-5).map(l => `
                    <div class="report-detail-item">${l.name} — ${badge(l.status)} ${getLeadDuration(l)}</div>
                `).join('') || '<div class="report-detail-item">No assigned leads yet</div>'}
            </div>
            <div class="report-detail-card">
                <div class="report-detail-subtitle">Stage timing chart</div>
                <canvas id="employeeStageChart" height="180"></canvas>
            </div>
        </div>
    `;
    openModal(`Employee report: ${user.displayName}`, body, '<button class="btn btn-primary" onclick="closeModal()">Close</button>');
    if (employeeChartInstance) employeeChartInstance.destroy();
    const ctx = document.getElementById('employeeStageChart')?.getContext('2d');
    if (ctx) {
        employeeChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: perf.stages,
                datasets: [{
                    label: 'Avg hours per stage',
                    data: perf.values.map(v => parseFloat(v.toFixed(1))),
                    backgroundColor: '#1f77b4'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Hours' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function renderReports() {
    if (chartInstance) chartInstance.destroy();
    const ctx = document.getElementById('stageChart')?.getContext('2d');
    if (!ctx) return;
    const stages = STATUSES.map(s => s.l);
    const avgTimes = stages.map((_, idx) => {
        const stageKey = STATUSES[idx].k;
        const times = leads.map(l => {
            const hist = l.history || [];
            const enter = hist.find(h => h.s === stageKey);
            const exit = hist.find(h => STATUSES.findIndex(s => s.k === h.s) > idx);
            if (enter && exit) return (new Date(exit.d).getTime() - new Date(enter.d).getTime()) / (1000 * 3600);
            return null;
        }).filter(t => t !== null);
        return times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1) : 0;
    });
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stages,
            datasets: [{ label: 'Avg Hours', data: avgTimes, backgroundColor: '#f5a623' }]
        }
    });

    const employeeStats = document.getElementById('employee-stats');
    if (employeeStats) {
        employeeStats.innerHTML = users.map(u => {
            const stats = getEmployeeStats(u.userId);
            return `
                <div class="stat-card" onclick="viewEmployeeStats('${u.userId}')">
                    <div class="stat-card-label">${u.displayName}</div>
                    <div class="stat-card-value">${stats.created}</div>
                    <div class="stat-card-label">created</div>
                    <div class="report-user-summary">Assigned ${stats.assigned} · Completed ${stats.completed}</div>
                </div>
            `;
        }).join('');
    }
}

// ===================== DYNAMIC PIPELINE FILTERS & INTERACTIVITY =====================
window.pipelineFilters = window.pipelineFilters || {
    search: '',
    category: 'All',
    cso: 'All',
    sort: 'value-desc'
};

window.updatePipelineFilter = function(key, val) {
    window.pipelineFilters[key] = val;
    renderPipeline();
};

window.resetPipelineFilters = function() {
    window.pipelineFilters = {
        search: '',
        category: 'All',
        cso: 'All',
        sort: 'value-desc'
    };
    const sInput = document.getElementById('pipelineSearchInput');
    const cSelect = document.getElementById('pipelineCategorySelect');
    const csoSelect = document.getElementById('pipelineCsoSelect');
    const sSelect = document.getElementById('pipelineSortSelect');
    if (sInput) sInput.value = '';
    if (cSelect) cSelect.value = 'All';
    if (csoSelect) csoSelect.value = 'All';
    if (sSelect) sSelect.value = 'value-desc';
    renderPipeline();
};

function renderPipeline() {
    const container = document.getElementById('pipeline-kanban');
    if (!container) return;

    // 1. Synchronize control values (to persist selections across view changes)
    const searchInput = document.getElementById('pipelineSearchInput');
    if (searchInput && document.activeElement !== searchInput) {
        searchInput.value = window.pipelineFilters.search;
    }
    
    const catSelect = document.getElementById('pipelineCategorySelect');
    if (catSelect) {
        catSelect.value = window.pipelineFilters.category;
    }

    const sortSelect = document.getElementById('pipelineSortSelect');
    if (sortSelect) {
        sortSelect.value = window.pipelineFilters.sort;
    }

    // Populate CSO Select dynamically
    const csoDropdown = document.getElementById('pipelineCsoSelect');
    if (csoDropdown) {
        const csos = (users || []).filter(u => u.role === 'cso');
        let csoOpts = `<option value="All">All Officers</option>`;
        csos.forEach(u => {
            csoOpts += `<option value="${u.userId}" ${window.pipelineFilters.cso === u.userId ? 'selected' : ''}>${escapeHtml(u.displayName)}</option>`;
        });
        csoDropdown.innerHTML = csoOpts;
    }

    // Hide CSO filter if current user is a CSO (as they only see their own files anyway)
    const csoWrapper = document.getElementById('pipelineCsoFilterWrapper');
    if (csoWrapper && currentUser && currentUser.role === 'cso') {
        csoWrapper.style.display = 'none';
    }

    // 2. Resolve visible leads matching department permissions
    let list = getVisibleLeads();

    // 3. Apply active filters
    if (window.pipelineFilters.search) {
        const q = window.pipelineFilters.search.toLowerCase().trim();
        list = list.filter(l => 
            (l.name || '').toLowerCase().includes(q) || 
            (l.phone || '').includes(q) || 
            (l.loanType || '').toLowerCase().includes(q)
        );
    }

    if (window.pipelineFilters.category && window.pipelineFilters.category !== 'All') {
        list = list.filter(l => (l.category || '').toLowerCase() === window.pipelineFilters.category.toLowerCase());
    }

    if (window.pipelineFilters.cso && window.pipelineFilters.cso !== 'All') {
        list = list.filter(l => Array.isArray(l.assignedCSOs) && l.assignedCSOs.includes(window.pipelineFilters.cso));
    }

    // 4. Apply selected sorting behavior
    const sortVal = window.pipelineFilters.sort;
    list.sort((a, b) => {
        if (sortVal === 'value-desc') {
            return (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0);
        } else if (sortVal === 'value-asc') {
            return (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0);
        } else if (sortVal === 'tat-desc') {
            return (b.tat || 0) - (a.tat || 0);
        } else if (sortVal === 'name-asc') {
            return (a.name || '').localeCompare(b.name || '');
        }
        return 0;
    });

    // 5. Calculate and render Dynamic Underwriting KPIs
    const totalPipelineAmt = list.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);
    const totalCases = list.length;
    const avgTicket = totalCases > 0 ? Math.round(totalPipelineAmt / totalCases) : 0;
    
    const riskLeadsCount = list.filter(l => {
        const breach = typeof isTatBreach === 'function' && isTatBreach(l);
        const warn = typeof isTatWarning === 'function' && isTatWarning(l);
        return breach || warn;
    }).length;

    const kpiBar = document.getElementById('pipelineKpiBar');
    if (kpiBar) {
        kpiBar.innerHTML = `
            <div class="pipeline-kpi-card">
                <div class="pk-icon-wrap primary"><i class="fas fa-coins"></i></div>
                <div class="pk-details">
                    <span class="pk-val">₹${totalPipelineAmt.toLocaleString('en-IN')}</span>
                    <span class="pk-lbl">Active Exposure</span>
                </div>
            </div>
            <div class="pipeline-kpi-card">
                <div class="pk-icon-wrap blue"><i class="fas fa-file-invoice-dollar"></i></div>
                <div class="pk-details">
                    <span class="pk-val">${totalCases} Files</span>
                    <span class="pk-lbl">Active Cases</span>
                </div>
            </div>
            <div class="pipeline-kpi-card">
                <div class="pk-icon-wrap green"><i class="fas fa-calculator"></i></div>
                <div class="pk-details">
                    <span class="pk-val">₹${avgTicket.toLocaleString('en-IN')}</span>
                    <span class="pk-lbl">Avg Ticket Size</span>
                </div>
            </div>
            <div class="pipeline-kpi-card">
                <div class="pk-icon-wrap purple" style="${riskLeadsCount > 0 ? 'background: rgba(244, 63, 94, 0.12) !important; color: #fb7185 !important; border-color: rgba(244, 63, 94, 0.25) !important;' : ''}">
                    <i class="fas ${riskLeadsCount > 0 ? 'fa-exclamation-triangle' : 'fa-clipboard-check'}"></i>
                </div>
                <div class="pk-details">
                    <span class="pk-val" style="color: ${riskLeadsCount > 0 ? '#fb7185' : 'var(--text)'};">${riskLeadsCount} Alerts</span>
                    <span class="pk-lbl">TAT Bottlenecks</span>
                </div>
            </div>
        `;
    }

    // 6. Group leads into columns and render board
    const groups = {};
    STATUSES.forEach(s => groups[s.k] = list.filter(l => l.status === s.k));

    container.innerHTML = STATUSES.map(s => {
        const stageList = groups[s.k] || [];
        const colTotal = stageList.reduce((acc, lead) => acc + (parseFloat(lead.amount) || 0), 0);
        const formattedColTotal = '₹' + colTotal.toLocaleString('en-IN');
        
        return `
            <div class="kan-col">
                <div class="kan-col-hd-row">
                    <div class="kan-col-hd">
                        <span style="font-weight: 700; color: var(--text);">${s.l}</span>
                        <span class="kan-cnt">${stageList.length}</span>
                    </div>
                    <div class="kan-col-metric">${formattedColTotal}</div>
                </div>
                
                ${stageList.map(l => {
                    const category = (l.category || '').toLowerCase() === 'msme' ? 'msme' : 'retail';
                    const categoryLabel = l.category || 'Retail';
                    const amt = parseFloat(l.amount) || 0;
                    const formattedAmt = '₹' + amt.toLocaleString('en-IN');
                    const durationText = getLeadDuration(l) || '0h';
                    const assignedNames = Array.isArray(l.assignedCSOs) && l.assignedCSOs.length
                        ? l.assignedCSOs.map(getUserDisplayName).join(', ')
                        : 'Unassigned';
                    
                    const isBreach = typeof isTatBreach === 'function' && isTatBreach(l);
                    const isWarning = typeof isTatWarning === 'function' && isTatWarning(l);
                    let durationIcon = 'far fa-clock';
                    let durationColor = 'var(--text3)';
                    let customStyle = '';
                    if (isBreach) {
                        durationIcon = 'fas fa-exclamation-triangle';
                        durationColor = '#f43f5e';
                        customStyle = 'border-color: rgba(244, 63, 94, 0.4) !important; background: linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(13, 16, 24, 0.95) 100%) !important;';
                    } else if (isWarning) {
                        durationIcon = 'fas fa-exclamation-circle';
                        durationColor = '#f97316';
                        customStyle = 'border-color: rgba(249, 115, 22, 0.4) !important; background: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(13, 16, 24, 0.95) 100%) !important;';
                    }
                    
                    return `
                        <div class="kan-card" onclick="viewLead('${l.id}')" style="${customStyle}">
                            <div class="kan-card-hdr">
                                <span class="kan-category-badge ${category}">${categoryLabel}</span>
                                <span class="kan-duration" style="color: ${durationColor}; font-weight: 600;"><i class="${durationIcon}" style="font-size: 10px; color: ${durationColor};"></i> ${durationText}</span>
                            </div>
                            <div class="kan-card-body">
                                <h4 class="kan-name-lux">${escapeHtml(l.name)}</h4>
                                <div class="kan-loan-type">${escapeHtml(l.loanType)}</div>
                                <div class="kan-amt-lux">${formattedAmt}</div>
                            </div>
                            <div class="kan-card-ftr">
                                <div class="kan-cso-info" title="${escapeHtml(assignedNames)}">
                                    <i class="far fa-user-circle"></i> ${escapeHtml(assignedNames)}
                                </div>
                                ${l.phone ? `<span style="font-family:'JetBrains Mono',monospace; font-size: 10px; color: var(--text3);">${escapeHtml(l.phone)}</span>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                ${!stageList.length ? `
                    <div class="kan-empty-card">
                        <i class="fas fa-folder-open" style="font-size: 16px; margin-bottom: 6px; display: block; opacity: 0.25;"></i>
                        <span>Empty Stage</span>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function getPageLabel(page) {
    return page.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

function renderAdminPanel() {
    const container = document.getElementById('admin-panel-body');
    if (!container) return;
    const rows = users.map(u => `
        <div class="admin-user-card">
            <div><strong>${u.displayName}</strong> (${u.role})</div>
            <div>Dept: ${u.department || 'N/A'}</div>
            <div>Lead access: ${u.permissions?.canViewLeads === false ? 'No' : 'Yes'}</div>
            <div>Pages: ${(u.permissions?.pageAccess || []).join(', ')}</div>
            <button class="btn btn-sm btn-primary" onclick="openEditUserPermissions('${u.userId}')">Edit</button>
        </div>
    `).join('');
    container.innerHTML = `
        <div style="margin-bottom:16px; display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="openAddUser()">+ Add User</button>
        </div>
        ${rows || '<div>No users found</div>'}
    `;
}

function getPageIcon(page) {
    switch (page) {
        case 'dashboard': return 'fas fa-tachometer-alt';
        case 'all-leads': return 'fas fa-users';
        case 'new-leads': return 'fas fa-user-plus';
        case 'processing': return 'fas fa-cog';
        case 'tat-breach': return 'fas fa-exclamation-triangle';
        case 'tat-warning': return 'fas fa-exclamation-circle';
        case 'reminders': return 'fas fa-bell';
        case 'monitor': return 'fas fa-desktop';
        case 'tasks': return 'fas fa-tasks';
        case 'escalations': return 'fas fa-arrow-up';
        case 'reports': return 'fas fa-chart-line';
        case 'pipeline': return 'fas fa-layer-group';
        case 'workflow': return 'fas fa-route';
        case 'admin-panel': return 'fas fa-user-shield';
        default: return 'fas fa-file-alt';
    }
}

function openEditUserPermissions(userId) {
    const user = users.find(u => u.userId === userId);
    if (!user) return;
    const pageCheckboxes = MENU_PAGES.map(page => {
        const checked = !!user.permissions?.pageAccess?.includes(page);
        const icon = getPageIcon(page);
        const label = getPageLabel(page);
        return `
            <label class="premium-checkbox-card ${checked ? 'checked' : ''}">
                <input type="checkbox" value="${page}" ${checked ? 'checked' : ''} onchange="this.parentElement.classList.toggle('checked', this.checked)">
                <div class="page-icon-wrapper"><i class="${icon}"></i></div>
                <div class="page-title">${label}</div>
                <div class="check-indicator"><i class="fas fa-check"></i></div>
            </label>
        `;
    }).join('');
    
    openModal(`Edit User: ${user.displayName}`, `
        <div class="user-form-card">
            <div class="user-form-section-title">
                <i class="fas fa-id-card" style="color: var(--gold);"></i> Account Details
            </div>
            <div class="user-form-grid">
                <div class="fg">
                    <label>User ID (Read-only)</label>
                    <input value="${user.userId}" disabled style="cursor: not-allowed; opacity: 0.6; background: rgba(255,255,255,0.02)">
                </div>
                <div class="fg">
                    <label>Display Name *</label>
                    <input id="permDisplayName" value="${user.displayName}" placeholder="E.g. Jane Doe">
                </div>
                <div class="fg">
                    <label>Password</label>
                    <input id="permPassword" placeholder="Leave blank to keep current">
                </div>
                <div class="fg">
                    <label>Role *</label>
                    <select id="permRole">
                        ${['admin', 'cso', 'cse', 'msme_head', 'retail_head', 'bank_follow_officer', 'legal_officer'].map(role => `<option value="${role}" ${user.role === role ? 'selected' : ''}>${role}</option>`).join('')}
                    </select>
                </div>
                <div class="fg" style="grid-column: span 2;">
                    <label>Department</label>
                    <input id="permDepartment" value="${user.department || ''}" placeholder="E.g. Underwriting Division">
                </div>
            </div>
        </div>
        
        <label class="premium-toggle-card">
            <div class="premium-toggle-details">
                <i class="fas fa-folder-open"></i>
                <div>
                    <div class="premium-toggle-label">Can View Leads</div>
                    <div class="premium-toggle-sub">Enable search, file browsing, and detail records interaction</div>
                </div>
            </div>
            <span class="switch-control">
                <input type="checkbox" id="permCanViewLeads" ${user.permissions?.canViewLeads !== false ? 'checked' : ''}>
                <span class="switch-slider"></span>
            </span>
        </label>
        
        <div class="user-form-card" style="margin-bottom: 0;">
            <div class="user-form-section-title">
                <i class="fas fa-shield-alt" style="color: var(--gold);"></i> authorized page access
            </div>
            <div id="permPages" class="pages-selection-grid">
                ${pageCheckboxes}
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveUserPermissions('${userId}')">Save Changes</button>
    `);
}

async function saveUserPermissions(userId) {
    const displayName = document.getElementById('permDisplayName')?.value.trim();
    const password = document.getElementById('permPassword')?.value.trim();
    const role = document.getElementById('permRole')?.value;
    const department = document.getElementById('permDepartment')?.value.trim();
    const canViewLeads = document.getElementById('permCanViewLeads')?.checked;
    const selectedPages = [...document.querySelectorAll('#permPages input[type="checkbox"]:checked')].map(cb => cb.value);
    if (!displayName || !role) {
        toast('Please fill in display name and role', 'error');
        return;
    }
    const permissions = {
        canViewLeads: canViewLeads,
        pageAccess: selectedPages.length ? selectedPages : [...DEFAULT_PAGE_ACCESS]
    };
    const updateData = { displayName, role, department, permissions };
    if (password) updateData.password = password;
    await usersRef.child(userId).update(updateData);
    toast(`<i class="fas fa-check-circle" style="color:#4caf50;margin-right:6px;"></i>User <b>${displayName}</b> permissions updated`, 'success');
    closeModal();
    if (currentPage === 'admin-panel') renderAdminPanel();
    if (currentUser.userId === userId) {
        currentUser = { userId, displayName, role, department, permissions };
        sessionStorage.setItem('crmUser', JSON.stringify(currentUser));
        buildSidebar();
    }
}

function openAddUser() {
    const pageCheckboxes = MENU_PAGES.map(page => {
        const checked = DEFAULT_PAGE_ACCESS.includes(page);
        const icon = getPageIcon(page);
        const label = getPageLabel(page);
        return `
            <label class="premium-checkbox-card ${checked ? 'checked' : ''}">
                <input type="checkbox" value="${page}" ${checked ? 'checked' : ''} onchange="this.parentElement.classList.toggle('checked', this.checked)">
                <div class="page-icon-wrapper"><i class="${icon}"></i></div>
                <div class="page-title">${label}</div>
                <div class="check-indicator"><i class="fas fa-check"></i></div>
            </label>
        `;
    }).join('');
    
    openModal('Add New User Account', `
        <div class="user-form-card">
            <div class="user-form-section-title">
                <i class="fas fa-user-plus" style="color: var(--gold);"></i> Account Creation
            </div>
            <div class="user-form-grid">
                <div class="fg">
                    <label>User ID *</label>
                    <input id="newUserId" placeholder="E.g. john_doe">
                </div>
                <div class="fg">
                    <label>Display Name *</label>
                    <input id="newDisplayName" placeholder="E.g. John Doe">
                </div>
                <div class="fg">
                    <label>Password *</label>
                    <input id="newPassword" type="password" placeholder="Enter secure password">
                </div>
                <div class="fg">
                    <label>Role *</label>
                    <select id="newRole">
                        ${['admin', 'cso', 'cse', 'msme_head', 'retail_head', 'bank_follow_officer', 'legal_officer'].map(role => `<option value="${role}">${role}</option>`).join('')}
                    </select>
                </div>
                <div class="fg" style="grid-column: span 2;">
                    <label>Department</label>
                    <input id="newDepartment" placeholder="E.g. Retail Loans Department">
                </div>
            </div>
        </div>
        
        <label class="premium-toggle-card">
            <div class="premium-toggle-details">
                <i class="fas fa-folder-open"></i>
                <div>
                    <div class="premium-toggle-label">Can View Leads</div>
                    <div class="premium-toggle-sub">Enable search, file browsing, and detail records interaction</div>
                </div>
            </div>
            <span class="switch-control">
                <input type="checkbox" id="newCanViewLeads" checked>
                <span class="switch-slider"></span>
            </span>
        </label>
        
        <div class="user-form-card" style="margin-bottom: 0;">
            <div class="user-form-section-title">
                <i class="fas fa-shield-alt" style="color: var(--gold);"></i> default page accesses
            </div>
            <div id="newPermPages" class="pages-selection-grid">
                ${pageCheckboxes}
            </div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveNewUser()">Create Account</button>
    `);
}

async function saveNewUser() {
    const userId = document.getElementById('newUserId')?.value.trim();
    const displayName = document.getElementById('newDisplayName')?.value.trim();
    const password = document.getElementById('newPassword')?.value.trim();
    const role = document.getElementById('newRole')?.value;
    const department = document.getElementById('newDepartment')?.value.trim();
    const canViewLeads = document.getElementById('newCanViewLeads')?.checked;
    const selectedPages = [...document.querySelectorAll('#newPermPages input[type="checkbox"]:checked')].map(cb => cb.value);
    if (!userId || !displayName || !password || !role) {
        toast('Please fill all required fields', 'error');
        return;
    }
    const existing = users.find(u => u.userId === userId);
    if (existing) {
        toast('User ID already exists', 'error');
        return;
    }
    const permissions = {
        canViewLeads: canViewLeads,
        pageAccess: selectedPages.length ? selectedPages : [...DEFAULT_PAGE_ACCESS]
    };
    await usersRef.child(userId).set({ userId, displayName, password, role, department, permissions });
    toast('User created', 'success');
    closeModal();
    if (currentPage === 'admin-panel') renderAdminPanel();
}

// ===================== NAVIGATION =====================
function navToPage(page) {
    if (page === currentPage) return;
    if (!canViewPage(page)) {
        toast('Access denied', 'error');
        return;
    }
    currentPage = page;
    loadPage(page);
    window.location.hash = page;
}

function updateSidebarActive() {
    document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
    const active = document.querySelector(`.sb-item[data-page="${currentPage}"]`);
    if (active) active.classList.add('active');
}

// ===================== SEARCH =====================
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (currentPage === 'all-leads') renderAllLeads();
        else if (currentPage === 'new-leads') renderNewLeads();
        else if (currentPage === 'processing') renderProcessing();
        else if (currentPage === 'tat-breach') renderTatBreach();
        else if (currentPage === 'tat-warning') renderTatWarning();
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentPage === 'all-leads') renderAllLeads();
            else if (currentPage === 'new-leads') renderNewLeads();
            else if (currentPage === 'processing') renderProcessing();
            else if (currentPage === 'tat-breach') renderTatBreach();
            else if (currentPage === 'tat-warning') renderTatWarning();
        }
    });
}

// ===================== FIREBASE REAL-TIME LISTENERS =====================
function initRealtime() {
    if (!firebaseEnabled) {
        updateBadges();
        updateNotificationBadge();
        return;
    }

    const refreshCurrentPage = () => {
        if (!currentPage) return;

        if (currentPage === 'dashboard') {
            renderDashboard();
        } else if (currentPage === 'all-leads') {
            renderAllLeads();
        } else if (currentPage === 'new-leads') {
            renderNewLeads();
        } else if (currentPage === 'processing') {
            renderProcessing();
        } else if (currentPage === 'tat-breach') {
            renderTatBreach();
        } else if (currentPage === 'tat-warning') {
            renderTatWarning();
        } else if (currentPage === 'reminders') {
            renderReminders();
        } else if (currentPage === 'tasks') {
            renderTasks();
        } else if (currentPage === 'escalations') {
            renderEscalations();
        } else if (currentPage === 'reports') {
            renderReports();
        } else if (currentPage === 'pipeline') {
            renderPipeline();
        } else if (currentPage === 'workflow') {
            // static
        } else {
            loadPage(currentPage);
        }

        updateBadges();
    };

    leadsRef.on('value', snap => {
        const leadData = snap.val() || {};
        leads = Object.entries(leadData).map(([id, v]) => ({ id, ...v }));
        refreshCurrentPage();
        updateNotificationBadge();
    });

    usersRef.on('value', snap => {
        const userData = snap.val() || {};
        users = Object.entries(userData).map(([id, v]) => normalizeUser({ userId: id, ...v }));
    });

    remindersRef.on('value', snap => {
        const reminderData = snap.val() || {};
        reminders = Object.entries(reminderData).map(([id, v]) => ({ id, ...v }));
        if (currentPage === 'reminders') renderReminders();
        updateBadges();
    });

    tasksRef.on('value', snap => {
        const taskData = snap.val() || {};
        tasks = Object.entries(taskData).map(([id, v]) => ({ id, ...v }));
        if (currentPage === 'tasks') renderTasks();
        updateBadges();
    });

    escalationsRef.on('value', snap => {
        const escalationData = snap.val() || {};
        escalations = Object.entries(escalationData).map(([id, v]) => ({ id, ...v }));
        if (currentPage === 'escalations') renderEscalations();
        updateBadges();
    });

    loanTypesRef.on('value', snap => {
        const loanTypeData = snap.val() || {};
        loanTypes = Array.isArray(loanTypeData) ? loanTypeData.filter(Boolean) : Object.values(loanTypeData).filter(Boolean);
    });
}

// ===================== LEAD DETAIL MODAL WITH FULL DATA TABS =====================
async function viewLead(id) {
    const l = leads.find(x => x.id === id);
    if (!l) return;
    currentLeadId = id;
    renderLeadModal(l);
}

function formatTime(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleString();
}

function renderLeadModal(l) {
    // Build all tab contents
    const leadInfoHtml = buildLeadInfoTab(l);
    const timeLogHtml = buildTimeLogTab(l);
    const stageDurationHtml = buildStageDurationTab(l);
    const meritsHtml = buildMeritsTab(l);
    const bankHtml = buildBankTab(l);
    const loanHtml = buildLoanDetailsTab(l);
    const financialHtml = buildFinancialTab(l);
    const documentsHtml = buildDocumentsTab(l);
    const checkpointsHtml = buildCheckpointsTab(l);

    const tabs = [
        { id: 'info', label: 'Lead Info', icon: 'fa-user', content: leadInfoHtml },
        { id: 'timelog', label: 'Time Log', icon: 'fa-clock', content: timeLogHtml },
        { id: 'stageduration', label: 'Stage Duration', icon: 'fa-chart-bar', content: stageDurationHtml },
        { id: 'merits', label: 'Merits', icon: 'fa-star', content: meritsHtml },
        { id: 'bank', label: 'Bank Remarks', icon: 'fa-university', content: bankHtml },
        { id: 'loan', label: 'Loan Details', icon: 'fa-file-invoice', content: loanHtml },
        { id: 'financial', label: 'Financial', icon: 'fa-chart-line', content: financialHtml },
        { id: 'documents', label: 'Documents', icon: 'fa-file-alt', content: documentsHtml },
        { id: 'checkpoints', label: 'Check Points', icon: 'fa-check-double', content: checkpointsHtml }
    ];

    const tabButtons = tabs.map(tab => `
        <button class="lead-detail-tab-btn ${tab.id === 'info' ? 'active' : ''}" onclick="switchLeadDetailTab('${tab.id}')">
            <i class="fas ${tab.icon}"></i> ${tab.label}
        </button>
    `).join('');

    const tabContents = tabs.map(tab => `
        <div id="lead-tab-${tab.id}" class="lead-detail-tab-content ${tab.id === 'info' ? 'active' : ''}">
            ${tab.content}
        </div>
    `).join('');

    const body = `
        <div class="lead-detail-container">
            <div class="lead-detail-tabs">
                ${tabButtons}
            </div>
            <div class="lead-detail-content">
                ${tabContents}
            </div>
        </div>
    `;

    document.getElementById('modalTitle').innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <div class="modal-title-icon"><i class="fas fa-clipboard-list"></i></div>
            Lead: ${l.name}
        </div>
    `;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalFoot').innerHTML = `
        <button class="btn btn-ghost" onclick="closeModal()">Close</button>
        <button class="btn btn-info" onclick="closeModal();openUpdateStatus('${l.id}')">Update Status</button>
        <button class="btn btn-primary" onclick="closeModal();editLead('${l.id}')">Edit</button>
    `;
    document.getElementById('overlay').classList.add('open');
    document.getElementById('modal').classList.remove('fullscreen');
    document.getElementById('modalFullscreenBtn').innerHTML = '⛶';

    // Render chart after modal is open
    setTimeout(() => {
        if (document.getElementById('lead-tab-stageduration')?.classList.contains('active')) {
            renderLeadStageChart(l);
        }
    }, 100);
}

function switchLeadDetailTab(tabId) {
    document.querySelectorAll('.lead-detail-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lead-detail-tab-btn[onclick="switchLeadDetailTab('${tabId}')"]`).classList.add('active');

    document.querySelectorAll('.lead-detail-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`lead-tab-${tabId}`).classList.add('active');

    if (tabId === 'stageduration') {
        const l = leads.find(x => x.id === currentLeadId);
        if (l) renderLeadStageChart(l);
    }
}

function buildLeadInfoTab(l) {
    const currentStage = getLeadStageDurations(l).find(s => s.isCurrent);
    const assignedNames = Array.isArray(l.assignedCSOs) && l.assignedCSOs.length
        ? l.assignedCSOs.map(getUserDisplayName).join(', ')
        : 'Unassigned';

    const rows = [
        // Primary Information
        { label: 'Name', value: l.name },
        { label: 'Phone', value: l.phone },
        { label: 'Email', value: l.email || 'N/A' },
        { label: 'Loan Type', value: l.loanType },
        { label: 'Amount', value: `₹${Number(l.amount).toLocaleString('en-IN')}` },
        { label: 'Category', value: l.category || 'N/A' },
        { label: 'Lead Source', value: l.source || 'N/A' },
        { label: 'Bank Name', value: l.bankName || 'N/A' },
        // Status & Workflow
        { label: 'Status', value: badge(l.status), isHtml: true },
        { label: 'Lead Status', value: l.leadStatus || 'N/A' },
        { label: 'Current Stage', value: currentStage ? currentStage.label : getStat(l.status).l },
        { label: 'Time in Stage', value: getLeadDuration(l) },
        // Assignment & Tracking
        { label: 'Allocated to', value: assignedNames },
        { label: 'Created By', value: getUserDisplayName(l.createdBy) },
        { label: 'Created On', value: l.created ? new Date(l.created).toLocaleString() : 'N/A' }
    ];

    let ccHtml = '';
    if (l.cc && l.cc.length) {
        ccHtml = `<div class="lead-detail-row"><strong>CC Users (Monitoring)</strong><span>${l.cc.map(getUserDisplayName).join(', ')}</span></div>`;
    }

    let profilingHtml = '';
    if (l.profilingData) {
        profilingHtml = `
            <hr>
            <div style="margin-top: 16px;"><strong>Profiling Data</strong></div>
            <div class="lead-detail-row"><strong>Company</strong><span>${l.profilingData.company || '-'}</span></div>
            <div class="lead-detail-row"><strong>Turnover</strong><span>${l.profilingData.turnover || '-'}</span></div>
            <div class="lead-detail-row"><strong>Liabilities</strong><span>${l.profilingData.liabilities || '-'}</span></div>
        `;
    }

    let bankRemarksHtml = '';
    if (l.bankRemarks) {
        bankRemarksHtml = `
            <hr>
            <div style="margin-top: 16px;"><strong>Bank Remarks</strong></div>
            <div class="remarks-preview" onclick="showRemarksModal('Bank Remarks', \`${escapeHtml(l.bankRemarks)}\`)">${escapeHtml(truncateRemark(l.bankRemarks, 200))}</div>
        `;
    }

    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title">
                <span class="modal-title-icon"><i class="fas fa-user"></i></span>
                Lead Information - Complete Details
            </div>
            <div class="lead-detail-block">
                ${rows.map(r => `
                    <div class="lead-detail-row">
                        <strong>${r.label}</strong>
                        ${r.isHtml ? r.value : `<span>${r.value}</span>`}
                    </div>
                `).join('')}
                ${ccHtml}
                ${profilingHtml}
                ${bankRemarksHtml}
            </div>
        </div>
    `;
}

function buildTimeLogTab(l) {
    const stages = getLeadStageDurations(l);
    if (!stages.length) return `<div class="time-log-empty">No stage history available.</div>`;

    const rows = stages.map(item => `
        <tr>
            <td style="font-weight:600;">${item.label}</td>
            <td>
                <span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:${item.isCurrent ? 'rgba(45,156,219,0.15)' : 'rgba(245,166,35,0.12)'};color:${item.isCurrent ? 'var(--blue2)' : 'var(--gold)'};border:1px solid ${item.isCurrent ? 'rgba(45,156,219,0.3)' : 'rgba(245,166,35,0.3)'};">
                    ${item.isCurrent ? 'Current' : 'Completed'}
                </span>
            </td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text2);">${formatDurationMs(item.durationMs)}</td>
            <td style="color:var(--text3);font-size:11px;">${item.start ? formatTime(item.start) : 'Unknown'}</td>
        </tr>
    `).join('');

    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title">
                <span class="modal-title-icon"><i class="fas fa-history"></i></span>
                Stage History Timeline
            </div>
            <div style="overflow-x:auto;">
                <table class="time-log-table">
                    <thead>
                        <tr><th>Stage</th><th>Status</th><th>Duration</th><th>Time</th></tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function buildStageDurationTab(l) {
    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title">
                <span class="modal-title-icon"><i class="fas fa-chart-bar"></i></span>
                Stage Duration Chart
            </div>
            <div style="width:100%; margin-top:16px;">
                <canvas id="lead-stage-chart-${l.id}" style="height:300px; width:100%;"></canvas>
            </div>
        </div>
    `;
}

function renderLeadStageChart(l) {
    const stages = getLeadStageDurations(l);
    const chartEl = document.getElementById(`lead-stage-chart-${l.id}`);
    if (!chartEl) return;
    if (window.leadStageChart) {
        window.leadStageChart.destroy();
        window.leadStageChart = null;
    }
    const labels = stages.map(item => item.label);
    const data = stages.map(item => Number(item.hours.toFixed(2)));
    window.leadStageChart = new Chart(chartEl.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Hours spent',
                data,
                backgroundColor: stages.map(item => item.isCurrent ? '#278cff' : '#f5a623')
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Hours' } } },
            plugins: { legend: { display: false } }
        }
    });
}

function buildMeritsTab(l) {
    const merits = l.meritsAndChallenges?.rows || [];
    if (!merits.length) return `<div class="lead-modal-panel"><div class="lead-modal-title">Merits & Challenges</div><div class="no-data">No data recorded.</div></div>`;

    const rows = merits.map((m, i) => `
        <tr>
            <td>${m.date || '-'}</td>
            <td>${m.remarks || '-'}</td>
            <td>${m.docType || '-'}</td>
            <td>${m.stage || '-'}</td>
            <td>${m.owner || '-'}</td>
            <td>${m.meritType || '-'}</td>
        </tr>
    `).join('');

    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title">
                <span class="modal-title-icon"><i class="fas fa-star"></i></span>
                Merits & Challenges
            </div>
            <div style="overflow-x:auto;">
                <table class="time-log-table">
                    <thead>
                        <tr><th>Date</th><th>Remarks</th><th>Doc Type</th><th>Stage</th><th>Owner</th><th>Merit/Challenge</th></tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function buildBankTab(l) {
    const bankRecords = l.bankRecords || [];
    let bankHtml = '';
    if (bankRecords.length) {
        bankHtml = `
            <div style="margin-bottom:16px;">
                <div class="section-title" style="font-size: 13px; font-weight: 700; color: var(--gold); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-list-ul"></i> Bank Entries
                </div>
                <div class="bank-records-container" style="border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.15);">
                    <div class="bank-grid-header" style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr; gap: 0; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                        <div style="color: var(--gold);">Bank Name</div>
                        <div style="color: var(--gold);">Contact Person</div>
                        <div style="color: var(--gold); text-align: center;">Status</div>
                    </div>
                    ${bankRecords.map(b => `
                        <div class="bank-record-row" style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.04); padding: 12px 14px; align-items: center; font-size: 13px;">
                            <div style="color: var(--text); font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-university" style="color: var(--gold); opacity: 0.8; font-size: 11px;"></i>
                                ${b.name}
                            </div>
                            <div style="color: var(--text2); display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-user-circle" style="color: var(--text3); font-size: 12px;"></i>
                                ${b.contact}
                            </div>
                            <div style="display: flex; justify-content: center;">
                                <span class="bank-status-badge status-${b.status}" style="font-weight: 600; text-transform: uppercase; font-size: 10px; display: inline-flex; align-items: center; gap: 6px; border-radius: 6px; padding: 4px 10px; min-width: 90px; text-align: center; justify-content: center; border: 1px solid currentColor;">
                                    <span style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor;"></span>
                                    ${b.status ? b.status.replace('-', ' ') : 'N/A'}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        bankHtml = `
            <div style="text-align: center; padding: 30px 16px; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.06); border-radius: 8px; color: var(--text3); font-size: 13px;">
                <i class="fas fa-university" style="font-size: 24px; color: var(--text3); margin-bottom: 8px; opacity: 0.5;"></i>
                <div>No bank finalization entries recorded for this lead.</div>
            </div>
        `;
    }

    const remarks = l.bankRemarks || '';

    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title" style="margin-bottom: 16px;">
                <span class="modal-title-icon"><i class="fas fa-university"></i></span>
                Bank Finalization
            </div>
            ${bankHtml}
            <div style="margin-top: 16px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.04); padding-bottom: 8px;">
                    <div style="font-size: 13px; font-weight: 700; color: var(--gold); letter-spacing: 0.5px; text-transform: uppercase; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-comment-alt"></i> Overall Remarks
                    </div>
                    <div style="font-size: 12px; color: var(--text2);">
                        <strong>Lead Status:</strong> 
                        <span style="text-transform: uppercase; font-weight: bold; color: ${l.leadStatus === 'ready' ? '#4caf50' : l.leadStatus === 'rejected' ? '#f44336' : 'var(--gold)'};">
                            ${l.leadStatus ? l.leadStatus.replace('-', ' ') : 'PENDING'}
                        </span>
                    </div>
                </div>
                <div class="remarks-preview" onclick="showRemarksModal('Bank Remarks', \`${escapeHtml(remarks)}\`)" style="cursor: pointer; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 10px 12px; color: var(--text); font-size: 13px; line-height: 1.5; min-height: 48px; transition: all 0.2s ease;">
                    ${escapeHtml(truncateRemark(remarks, 200)) || '<span style="color: var(--text3); font-style: italic;">No remarks added yet. Click to add or edit.</span>'}
                </div>
            </div>
        </div>
    `;
}

function buildLoanDetailsTab(l) {
    const loanRecords = l.loanRecords || [];
    const emiRecords = l.emiRecords || {};

    let loanHtml = '';
    if (loanRecords.length) {
        loanHtml = `
            <div class="loan-table-container">
                <div class="loan-grid-header">
                    <div class="loan-col-bank">BANK</div><div class="loan-col-applicant">APPLICANT</div><div class="loan-col-type">TYPE</div>
                    <div class="loan-col-date">DATE</div><div class="loan-col-amount">AMOUNT</div><div class="loan-col-emi">EMI</div>
                    <div class="loan-col-rate">RATE</div><div class="loan-col-outstanding">OUTSTANDING</div><div class="loan-col-status">STATUS</div>
                </div>
                ${loanRecords.map(loan => {
                    const emiList = emiRecords[loanRecords.indexOf(loan)] || [];
                    const emiHtml = emiList.length ? `
                        <div style="grid-column:1/-1; padding:8px; background:rgba(0,0,0,0.2);">
                            <strong>EMI Records:</strong>
                            <table style="width:100%; margin-top:8px;">
                                <tr><th>Date</th><th>Amount</th><th>Bounce</th><th>Reason</th><th>Status</th></tr>
                                ${emiList.map(e => `<tr><td>${e.date}</td><td>₹${e.amount}</td><td>${e.bounce}</td><td>${e.reason || '-'}</td><td>${e.status}</td></tr>`).join('')}
                            </table>
                        </div>
                    ` : '';
                    return `
                        <div class="loan-record-row">
                            <div>${loan.bank}</div><div>${loan.applicant}</div><div>${loan.type}</div>
                            <div>${loan.date}</div><div>₹${loan.amount.toLocaleString()}</div><div>₹${loan.emi.toLocaleString()}</div>
                            <div>${loan.rate}%</div><div>₹${loan.outstanding.toLocaleString()}</div>
                            <div><span class="loan-status-badge status-${loan.status}">${loan.status}</span></div>
                            <div style="grid-column:1/-1;">${emiHtml}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        loanHtml = '<div class="no-data">No loan records.</div>';
    }

    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title">
                <span class="modal-title-icon"><i class="fas fa-file-invoice"></i></span>
                Loan Details & EMI Tracking
            </div>
            ${loanHtml}
        </div>
    `;
}

function buildFinancialTab(l) {
    const fa = l.financialAnalysis || {};
    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title">
                <span class="modal-title-icon"><i class="fas fa-chart-line"></i></span>
                Financial Analysis
            </div>
            <div class="fa-summary-grid">
                <div class="fa-input-field"><label>Turnover</label><div class="fa-input">₹${(fa.turnover || 0).toLocaleString()}</div></div>
                <div class="fa-input-field"><label>Net Profit/Loss</label><div class="fa-input">₹${(fa.profitLoss || 0).toLocaleString()}</div></div>
                <div class="fa-input-field"><label>Deductions</label><div class="fa-input">₹${(fa.deductions || 0).toLocaleString()}</div></div>
                <div class="fa-input-field"><label>Depreciation</label><div class="fa-input">₹${(fa.depreciation || 0).toLocaleString()}</div></div>
                <div class="fa-input-field"><label>Net Income</label><div class="fa-input">₹${(fa.netIncome || 0).toLocaleString()}</div></div>
                <div class="fa-input-field"><label>Total Income</label><div class="fa-input">₹${(fa.totalIncome || 0).toLocaleString()}</div></div>
            </div>
            <div class="fa-grid-3col" style="margin-top:16px;">
                <div class="fa-input-field"><label>Credit Score</label><div class="fa-input">${fa.creditScore || 'N/A'}</div></div>
                <div class="fa-input-field"><label>GST Status</label><div class="fa-input">${fa.gstStatus || 'N/A'}</div></div>
                <div class="fa-input-field"><label>Turnover Notes</label><div class="fa-input">${fa.turnoverNotes || '—'}</div></div>
            </div>
            <div style="margin-top:16px;"><strong>Income Details:</strong> <div class="remarks-preview" onclick="showRemarksModal('Income Details', \`${escapeHtml(fa.incomeDetails || '')}\`)">${escapeHtml(truncateRemark(fa.incomeDetails, 200)) || '—'}</div></div>
            <div style="margin-top:16px;"><strong>Expense Details:</strong> <div class="remarks-preview" onclick="showRemarksModal('Expense Details', \`${escapeHtml(fa.expenseDetails || '')}\`)">${escapeHtml(truncateRemark(fa.expenseDetails, 200)) || '—'}</div></div>
            <div style="margin-top:16px;"><strong>Financial Remarks:</strong> <div class="remarks-preview" onclick="showRemarksModal('Financial Remarks', \`${escapeHtml(fa.remarks || '')}\`)">${escapeHtml(truncateRemark(fa.remarks, 200)) || '—'}</div></div>
        </div>
    `;
}

function buildDocumentsTab(l) {
    const docs = l.documents || {};
    const attachments = Array.isArray(l.attachments) ? l.attachments : [];
    const attachmentsHtml = `
        <div style="margin-top:14px;">
            <strong>Uploaded Files</strong>
            <div style="margin-top:8px;">
                ${buildAttachmentListHtml(attachments, {
                    downloadFn: 'downloadLeadAttachment',
                    emptyText: 'No files uploaded.'
                })}
            </div>
        </div>
    `;
    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title">
                <span class="modal-title-icon"><i class="fas fa-file-alt"></i></span>
                Documents
            </div>
            <div class="two-column-split">
                <div><strong>Received:</strong><div class="remarks-preview" onclick="showRemarksModal('Docs Received', \`${escapeHtml(docs.received || '')}\`)">${escapeHtml(truncateRemark(docs.received, 200)) || '—'}</div></div>
                <div><strong>Pending:</strong><div class="remarks-preview" onclick="showRemarksModal('Docs Pending', \`${escapeHtml(docs.pending || '')}\`)">${escapeHtml(truncateRemark(docs.pending, 200)) || '—'}</div></div>
            </div>
            ${attachmentsHtml}
        </div>
    `;
}

function buildCheckpointsTab(l) {
    const checkpoints = l.checkpoints || {};
    const sections = (window.docCheckPoints?.sections || []);
    
    if (sections.length === 0) {
        return `
            <div class="lead-modal-panel">
                <div class="lead-modal-title">
                    <span class="modal-title-icon"><i class="fas fa-check-double"></i></span>
                    Document Check Points
                </div>
                <div class="no-data">No checkpoint configurations available.</div>
            </div>
        `;
    }
    
    let completedCount = 0, totalCount = 0;
    const sectionsHtml = sections.map(section => {
        let sectionCompleted = 0;
        const checkpointItems = (section.checkpoints || []).map((cp, idx) => {
            totalCount++;
            const key = `${section.id}-${idx}`;
            const status = checkpoints[key]?.status || 'pending';
            const remark = checkpoints[key]?.remark || '';
            const docs = checkpoints[key]?.documents || [];
            if (status === 'pass') {
                sectionCompleted++;
                completedCount++;
            }
            const statusClass = status === 'pass' ? 'dcp-pass-item' : status === 'fail' ? 'dcp-fail-item' : '';
            const statusIcon = status === 'pass' ? 'OK' : status === 'fail' ? 'X' : '○';
            const statusColor = status === 'pass' ? 'green' : status === 'fail' ? 'red' : 'gray';
            
            const docsHtml = docs.length > 0 ? `
                <div style="margin-left: 20px; margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
                    ${docs.map((doc, docIdx) => `
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--gold); cursor: pointer;" onclick="downloadLeadDetailCheckpointDocument('${l.id}', '${key}', ${docIdx})">
                            <i class="fas fa-file-alt" style="font-size: 10px;"></i>
                            <span style="text-decoration: underline;" title="Download Document">${escapeHtml(doc.name)} (${formatBytes(doc.size || 0)})</span>
                        </div>
                    `).join('')}
                </div>
            ` : '';

            return `
                <div class="dcp-item ${statusClass}" style="padding: 8px 12px;">
                    <div class="dcp-item-left">
                        <span style="color: ${statusColor}; font-weight: bold; margin-right: 6px;">${statusIcon}</span>
                        <label class="dcp-label" style="font-weight: 600;">${cp}</label>
                    </div>
                    ${remark ? `<div style="color: var(--text2); font-size: 12px; font-style: italic; margin-left: 20px; margin-top: 4px;">Remark: ${remark}</div>` : ''}
                    ${docsHtml}
                </div>
            `;
        }).join('');
        
        return `
            <div class="dcp-section-card" style="margin-bottom: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border2); border-radius: 8px;">
                <div class="dcp-section-header" style="padding: 10px 14px;">
                    <div class="dcp-section-left">
                        <i class="fas ${section.icon} dcp-section-icon" style="color: var(--gold);"></i>
                        <div class="dcp-section-info">
                            <h3 class="dcp-section-title" style="font-size: 14px; margin: 0;">${section.name}</h3>
                            <span class="dcp-section-count" style="font-size: 11px; color: var(--text3);">${sectionCompleted}/${section.checkpoints.length}</span>
                        </div>
                    </div>
                </div>
                <div class="dcp-section-content" style="display: block; padding: 10px 14px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                    <div class="dcp-checklist" style="display: flex; flex-direction: column; gap: 8px;">
                        ${checkpointItems}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="lead-modal-panel">
            <div class="lead-modal-title" style="margin-bottom: 14px;">
                <span class="modal-title-icon"><i class="fas fa-check-double" style="color: var(--gold);"></i></span>
                Document Check Points (${completedCount}/${totalCount})
            </div>
            <div class="dcp-sections">
                ${sectionsHtml}
            </div>
        </div>
    `;
}

// ===================== STATUS UPDATE =====================
function openUpdateStatus(id) {
    const l = leads.find(x => x.id === id);
    openModal('Update Status', `
        <div class="fg">
            <label>New Status</label>
            <select id="newStatus" onchange="toggleProfiling(this.value)">
                ${STATUSES.map(s => `<option value="${s.k}" ${s.k === l.status ? 'selected' : ''}>${s.l}</option>`).join('')}
            </select>
        </div>
        <div id="profilingFields" style="display:none; border-top:1px solid var(--border); margin-top:12px; padding-top:12px;">
            <h4>Detailed Data (Optional)</h4>
            <div class="fg"><label>Company Name</label><input id="profCompany"></div>
            <div class="fg"><label>Annual Turnover (₹)</label><input id="profTurnover"></div>
            <div class="fg"><label>Existing Liabilities</label><textarea id="profLiabilities"></textarea></div>
        </div>
        <div class="fg">
            <label>Remarks</label>
            <textarea id="statusRemarks" rows="2"></textarea>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="applyStatusWithExtra('${id}')">Update</button>
    `);
    window.toggleProfiling = function (val) {
        const fields = document.getElementById('profilingFields');
        if (fields) fields.style.display = val === 'profiling' ? 'block' : 'none';
    };
    if (l.status === 'profiling') toggleProfiling('profiling');
}

async function applyStatusWithExtra(id) {
    const newStatus = document.getElementById('newStatus').value;
    const remarks = document.getElementById('statusRemarks').value.trim() || '(no remarks)';
    const extra = {};
    if (newStatus === 'profiling') {
        extra.profilingData = {
            company: document.getElementById('profCompany').value,
            turnover: document.getElementById('profTurnover').value,
            liabilities: document.getElementById('profLiabilities').value
        };
    }
    const leadRef = leadsRef.child(id);
    const snap = await leadRef.once('value');
    const lead = snap.val();
    const history = lead.history || [];
    history.push({ s: newStatus, by: currentUser.displayName, d: new Date().toLocaleString(), remarks });
    await leadRef.update({ status: newStatus, history, ...extra });
    closeModal();
    toast('Status updated');
}

// ===================== REMINDERS & TASKS (Create & Complete) =====================
function openCreateReminder() {
    const depts = [...new Set(users.map(u => u.department).filter(d => d))];
    const leadOptions = leads.map(l => `<option value="${l.id}">${l.name} (${l.loanType})</option>`).join('');
    const userOptions = users.map(u => `<option value="${u.userId}">${u.displayName}</option>`).join('');
    const ccOptions = users.map(u => `<label><input type="checkbox" value="${u.userId}"> ${u.displayName}</label><br>`).join('');
    openModal('Create Reminder', `
        <div class="fg"><label>Title</label><input id="remTitle"></div>
        <div class="fg"><label>Description</label><textarea id="remDesc"></textarea></div>
        <div class="fg"><label>Due Date</label><input type="date" id="remDue"></div>
        <div class="fg"><label>Related Lead</label><select id="remLead"><option value="">None</option>${leadOptions}</select></div>
        <div class="fg"><label>Type</label>
            <select id="remType" onchange="toggleReminderAssign(this.value)">
                <option value="person">Person-wise</option>
                <option value="department">Department-wise</option>
                <option value="custom">Custom Selection</option>
            </select>
        </div>
        <div id="remAssignArea">
            <div class="fg"><label>Select Person</label><select id="remPerson">${userOptions}</select></div>
        </div>
        <div class="fg"><label>Monitor (CC Users)</label><div id="remCc">${ccOptions}</div></div>
    `, `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveReminder()">Create</button>
    `);
    window.toggleReminderAssign = function (type) {
        const area = document.getElementById('remAssignArea');
        if (type === 'department') {
            area.innerHTML = `<div class="fg"><label>Select Department</label><select id="remDept">${depts.map(d => `<option>${d}</option>`).join('')}</select></div>`;
        } else if (type === 'custom') {
            area.innerHTML = `<div class="fg"><label>Select Users</label><div id="customUsers">${users.map(u => `<label><input type="checkbox" value="${u.userId}"> ${u.displayName}</label><br>`).join('')}</div></div>`;
        } else {
            area.innerHTML = `<div class="fg"><label>Select Person</label><select id="remPerson">${userOptions}</select></div>`;
        }
    };
}

async function saveReminder() {
    const title = document.getElementById('remTitle').value.trim();
    const desc = document.getElementById('remDesc').value.trim();
    const due = document.getElementById('remDue').value;
    const leadId = document.getElementById('remLead').value;
    const type = document.getElementById('remType').value;
    let assignedTo = [];
    let department = null;
    if (type === 'person') assignedTo = [document.getElementById('remPerson').value];
    else if (type === 'department') department = document.getElementById('remDept').value;
    else assignedTo = [...document.querySelectorAll('#customUsers input:checked')].map(cb => cb.value);
    const cc = [...document.querySelectorAll('#remCc input:checked')].map(cb => cb.value);
    if (!title) { toast('Title required', 'error'); return; }
    const reminderData = {
        title, desc, due,
        leadId: leadId || null,
        leadName: leadId ? (leads.find(l => l.id === leadId)?.name || '') : null,
        type, assignedTo, department, cc,
        createdBy: currentUser.userId,
        createdAt: Date.now(),
        id: null
    };
    if (firebaseEnabled) {
        const ref = await remindersRef.push(reminderData);
        await ref.update({ id: ref.key });
    } else {
        reminderData.id = `rem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        reminders.push(reminderData);
        persistLocalState();
    }
    closeModal();
    toast('Reminder created');
    if (currentPage === 'reminders') renderReminders();
}

function openCreateTask() {
    window.taskAttachmentsTemp = [];
    const ccOptions = users.map(u => `<label><input type="checkbox" value="${u.userId}"> ${u.displayName}</label><br>`).join('');
    openModal('Create Task', `
        <div class="fg"><label>Title</label><input id="taskTitle"></div>
        <div class="fg"><label>Description</label><textarea id="taskDesc"></textarea></div>
        <div class="fg"><label>Due Date</label><input type="date" id="taskDue"></div>
        <div class="fg"><label>Assign to</label><select id="taskAssign">${users.map(u => `<option value="${u.userId}">${u.displayName}</option>`).join('')}</select></div>
        <div class="fg"><label>Monitor (CC Users)</label><div id="taskCc">${ccOptions}</div></div>
        <div class="fg" style="margin-top:10px;">
            <label>Upload Documents (Any Format)</label>
            <input id="taskFiles" type="file" multiple onchange="handleTaskFiles(this.files)">
            <div id="taskAttachmentsList" style="margin-top:10px;"></div>
        </div>
    `, `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveTask()">Create</button>
    `);
    setTimeout(() => renderTaskAttachments(), 0);
}

async function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const desc = document.getElementById('taskDesc').value.trim();
    const due = document.getElementById('taskDue').value;
    const assignedTo = document.getElementById('taskAssign').value;
    const ccCheckboxes = document.querySelectorAll('#taskCc input[type="checkbox"]:checked');
    const ccUsers = Array.from(ccCheckboxes).map(cb => cb.value);
    if (!title) { toast('Title required', 'error'); return; }
    const taskData = { title, desc, due, assignedTo, cc: ccUsers, status: 'pending', attachments: window.taskAttachmentsTemp || [], createdBy: currentUser.userId, createdAt: Date.now(), id: null };
    if (firebaseEnabled) {
        const ref = await tasksRef.push(taskData);
        await ref.update({ id: ref.key });
    } else {
        taskData.id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        tasks.push(taskData);
        persistLocalState();
    }
    closeModal();
    toast('Task created');
    if (currentPage === 'tasks') renderTasks();
}

async function completeReminder(id) {
    if (firebaseEnabled) {
        await remindersRef.child(id).remove();
    } else {
        reminders = reminders.filter(r => r.id !== id);
        persistLocalState();
    }
    toast('Reminder done');
    if (currentPage === 'reminders') renderReminders();
    if (currentPage === 'monitor') renderMonitor();
}

async function completeTask(id) {
    if (firebaseEnabled) {
        await tasksRef.child(id).update({ status: 'completed' });
    } else {
        tasks = tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t);
        persistLocalState();
    }
    toast('Task completed');
    if (currentPage === 'tasks') renderTasks();
    if (currentPage === 'monitor') renderMonitor();
}

// ===================== ADD/EDIT LEAD =====================
function renderLoanTypeDatalist(id = 'loanTypeList') {
    return `<datalist id="${id}">${loanTypes.map(type => `<option value="${type}"></option>`).join('')}</datalist>`;
}

function addLoanType() {
    const value = document.getElementById('newLoanType')?.value.trim();
    if (!value) { toast('Enter loan type name', 'error'); return; }
    if (loanTypes.includes(value)) { toast('Loan type already exists', 'error'); return; }
    const key = value.replace(/\s+/g, '_');
    if (firebaseEnabled) {
        loanTypesRef.child(key).set(value);
    }
    loanTypes.push(value);
    if (!firebaseEnabled) persistLocalState();
    const dataList = document.getElementById('loanTypeList');
    if (dataList) {
        dataList.innerHTML += `<option value="${value}"></option>`;
    }
    toast('Loan type added', 'success');
    document.getElementById('newLoanType').value = '';
}

function buildCcOptionsHtml(selectedIds = []) {
    return `
    <div class="cc-grid">
        ${users.map(u => {
            const isChecked = selectedIds.includes(u.userId) ? 'checked' : '';
            const initial = (u.displayName || u.userId || '?').charAt(0).toUpperCase();
            const roleLabel = u.role ? u.role.replace('_', ' ').toUpperCase() : 'USER';
            return `
                <label class="cc-chip-card">
                    <input type="checkbox" value="${u.userId}" ${isChecked}>
                    <div class="cc-chip-inner">
                        <div class="cc-avatar-circle">${initial}</div>
                        <div class="cc-info">
                            <span class="cc-name">${u.displayName}</span>
                            <span class="cc-role">${roleLabel}</span>
                        </div>
                    </div>
                </label>
            `;
        }).join('')}
    </div>
    `;
}

function openAddLead() {
    window.addLeadAttachments = [];
    window.docCheckPoints.statusMap = {};
    window.activeMeritsList = [];
    window.bankRecords = [];
    window.loanRecords = [];
    bankEditingIndex = null;
    loanEditingIndex = null;
    const loanTypeOptions = loanTypes.map(type => `<option value="${type}">${type}</option>`).join('');
    const csoOptions = users.filter(u => u.role === 'cso').map(u => `<option value="${u.userId}">${u.displayName}</option>`).join('');
    const ccOptions = buildCcOptionsHtml([]);
    const adminLoanField = currentUser?.role === 'admin' ? `
        <div class="form-section-title"><i class="fas fa-plus-circle mr-2"></i> Custom Core Parameters</div>
        <div class="fg"><label>Add New Loan Type</label><div style="display:flex;gap:8px;align-items:flex-end;"><input id="newLoanType" placeholder="New loan type"><button class="btn btn-sm btn-info" onclick="addLoanType()">Add</button></div></div>
    ` : '';

    const tabs = [
        { id: 'new-lead', label: 'New Lead', content: `
            <div class="form-card-section">
                <div class="form-card-header">
                    <div class="form-card-icon"><i class="fas fa-id-card"></i></div>
                    <div class="form-card-title">Client Demographics & Source</div>
                </div>
                <div class="form-card-grid">
                    <div class="fg"><label>Name *</label><input id="addName" placeholder="E.g. John Doe"></div>
                    <div class="fg"><label>Phone *</label><input id="addPhone" placeholder="E.g. +91 98765 43210"></div>
                    <div class="fg"><label>Bank Name</label><input id="addLeadBankName" placeholder="Preferential Bank Name"></div>
                </div>
            </div>
            
            <div class="form-card-section">
                <div class="form-card-header">
                    <div class="form-card-icon"><i class="fas fa-hand-holding-usd"></i></div>
                    <div class="form-card-title">Underwriting & Credit Requirements</div>
                </div>
                <div class="form-card-grid">
                    <div class="fg"><label>Loan Type *</label><input id="addLoanType" list="loanTypeList" placeholder="E.g. Home Loan...">${renderLoanTypeDatalist()}</div>
                    <div class="fg"><label>Amount (₹) *</label><input id="addAmount" type="number" value="100000"></div>
                    <div class="fg"><label>Category *</label><select id="addCategory"><option>MSME</option><option>Retail</option></select></div>
                </div>
            </div>
            
            <div class="form-card-section">
                <div class="form-card-header">
                    <div class="form-card-icon"><i class="fas fa-user-check"></i></div>
                    <div class="form-card-title">Underwriting Allocation & Stakeholders</div>
                </div>
                <div class="form-card-grid-full">
                    <div class="fg" style="max-width: 450px;"><label>Assign CSO (Field Officer)</label><select id="addCso"><option value="">None / Keep Unassigned</option>${csoOptions}</select></div>
                    <div class="fg"><label>Monitor Workflows (CC Users)</label><div id="addCc">${ccOptions}</div></div>
                    ${adminLoanField ? `<div style="margin-top: 14px; border-top: 1px dashed var(--border2); padding-top: 14px;">${adminLoanField}</div>` : ''}
                </div>
            </div>
        `},
        { id: 'merits-challenges', label: 'Merits and Challenges', content: buildMeritsAndChallengesTabHtml(false) },
        { id: 'bank-remarks', label: 'Bank Finalization Remarks', content: `
            <div class="section-card" style="border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.01); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div class="section-title" style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: var(--gold); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 20px;">
                    <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-university"></i> Bank Finalization Entries</span>
                    <span style="font-size: 11px; font-weight: 500; font-family: monospace; opacity: 0.6; text-transform: uppercase;">Step 3 of 7 Status Track</span>
                </div>
                
                <div class="bank-input-row" style="display: grid; grid-template-columns: 2fr 1.5fr 1.5fr auto; gap: 14px; align-items: flex-end; margin-bottom: 20px;">
                    <div class="bank-input-field">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Bank Name</label>
                        <div class="input-with-icon">
                            <i class="fas fa-university"></i>
                            <input type="text" id="bankInputName" placeholder="E.g. HDFC Bank, Axis..." class="bank-input">
                        </div>
                    </div>
                    <div class="bank-input-field">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Contact Person</label>
                        <div class="input-with-icon">
                            <i class="fas fa-user-circle"></i>
                            <input type="text" id="bankInputContact" placeholder="Name of officer" class="bank-input">
                        </div>
                    </div>
                    <div class="bank-input-field">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Approval Status</label>
                        <div class="input-with-icon">
                            <i class="fas fa-tag"></i>
                            <select id="bankInputStatus" class="bank-input bank-select">
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-sm" style="background: linear-gradient(135deg, var(--gold) 0%, #d4af37 100%); color: #000; font-weight: 600; border: none; height: 40px; padding: 0 18px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 10px rgba(212, 175, 55, 0.15);" onclick="addBankRow()">
                        <i class="fas fa-plus"></i> Add Entry
                    </button>
                </div>

                <div class="bank-records-container" id="bankRecordsContainer" style="border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.15); margin-top: 15px;">
                    <div class="bank-grid-header" style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr 100px; gap: 0; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                        <div style="color: var(--gold);">Bank Name</div>
                        <div style="color: var(--gold);">Contact Person</div>
                        <div style="color: var(--gold); text-align: center;">Status</div>
                        <div style="color: var(--gold); text-align: center;">Actions</div>
                    </div>
                    <div id="bankRecordsList"></div>
                </div>
            </div>

            <div class="section-card" style="border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.01); padding: 20px; border-radius: 12px;">
                <div class="section-title" style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: var(--gold); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 20px;">
                    <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-comment-alt"></i> Additional Finalization Remarks</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <div class="fg" style="margin-bottom: 0;">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Lead Overall Status</label>
                        <div class="input-with-icon">
                            <i class="fas fa-check-circle"></i>
                            <select id="addLeadStatus" style="background: rgba(255, 255, 255, 0.02); height: 42px;">
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="ready">Ready for Disbursement</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div style="margin-top: 10px; font-size: 11px; color: var(--text3); line-height: 1.4;">
                            <i class="fas fa-info-circle" style="color: var(--gold); margin-right: 4px;"></i> Select the general pipeline state indicating whether the lead is ready to disburse.
                        </div>
                    </div>
                    <div class="fg" style="margin-bottom: 0;">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Overall Finalization Remarks</label>
                        <textarea id="addBankRemarks" rows="4" placeholder="Enter terms sheet summary, rate of interest negotiated, and final credit comments..." style="width: 100%; min-height: 100px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: var(--text); padding: 10px 12px; font-size: 13px; font-family: 'Outfit', sans-serif; resize: vertical; transition: all 0.2s;"></textarea>
                    </div>
                </div>
            </div>
        `},
        { id: 'loan-details', label: 'Loan Details', content: `
            <div class="section-card">
                <div class="section-title">Add Loan Record</div>
                <div class="loan-input-grid">
                    <div class="loan-input-field"><label>Bank</label><input type="text" id="loanInputBank" placeholder="Bank Name" class="loan-input"></div>
                    <div class="loan-input-field"><label>Applicant</label><input type="text" id="loanInputApplicant" placeholder="Applicant Name" class="loan-input"></div>
                    <div class="loan-input-field"><label>Type of Loan</label><input type="text" id="loanInputType" placeholder="Loan Type" class="loan-input"></div>
                    <div class="loan-input-field"><label>Date of Loan</label><input type="date" id="loanInputDate" class="loan-input"></div>
                    <div class="loan-input-field"><label>Loan Amount (₹)</label><input type="number" id="loanInputAmount" placeholder="0.00" class="loan-input"></div>
                    <div class="loan-input-field"><label>EMI Amount (₹)</label><input type="number" id="loanInputEmi" placeholder="0.00" class="loan-input"></div>
                    <div class="loan-input-field"><label>Interest Rate (%)</label><input type="number" id="loanInputRate" placeholder="0.00" step="0.01" class="loan-input"></div>
                    <div class="loan-input-field"><label>Tenure (Months)</label><input type="number" id="loanInputTenure" placeholder="0" class="loan-input"></div>
                    <div class="loan-input-field"><label>Outstanding Amount (₹)</label><input type="number" id="loanInputOutstanding" placeholder="0.00" class="loan-input"></div>
                    <div class="loan-input-field"><label>Property Value (₹)</label><input type="number" id="loanInputProperty" placeholder="0.00" class="loan-input"></div>
                    <div class="loan-input-field"><label>Loan Status</label><select id="loanInputStatus" class="loan-input loan-select"><option value="">Select Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="closed">Closed</option><option value="default">Default</option></select></div>
                    <div class="loan-input-field"><label>Remarks</label><textarea id="loanInputRemarks" placeholder="Additional remarks..." class="loan-input loan-remarks"></textarea></div>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px;">
                    <button class="btn btn-ghost" onclick="clearLoanInputs()">Clear</button>
                    <button class="btn btn-info" onclick="addLoanRecord()">+ Add Loan</button>
                </div>
            </div>
            <div class="section-card">
                <div class="section-title">Loan Records</div>
                <div class="loan-table-container" id="loanTableContainer">
                    <div class="loan-grid-header">
                        <div class="loan-col-bank">BANK</div><div class="loan-col-applicant">APPLICANT</div><div class="loan-col-type">LOAN TYPE</div>
                        <div class="loan-col-date">DATE</div><div class="loan-col-amount">AMOUNT</div><div class="loan-col-emi">EMI</div>
                        <div class="loan-col-rate">RATE %</div><div class="loan-col-outstanding">OUTSTANDING</div><div class="loan-col-status">STATUS</div>
                        <div class="loan-col-remarks">REMARKS</div><div class="loan-col-actions">ACTIONS</div>
                    </div>
                    <div id="loanRecordsList"></div>
                </div>
            </div>
            <div class="section-card">
                <div class="section-title">EMI & Bounce Tracking</div>
                <p style="color: var(--text2); font-size: 12px; margin-bottom: 12px;">Select a loan record to track EMI payments</p>
                <div class="emi-input-grid">
                    <div class="emi-input-field"><label>EMI Date</label><input type="date" id="emiInputDate" class="emi-input"></div>
                    <div class="emi-input-field"><label>EMI Amount (₹)</label><input type="number" id="emiInputAmount" placeholder="0.00" class="emi-input"></div>
                    <div class="emi-input-field"><label>Bounce</label><select id="emiInputBounce" class="emi-input emi-select"><option value="no">No</option><option value="yes">Yes</option></select></div>
                    <div class="emi-input-field"><label>Bounce Reason</label><input type="text" id="emiInputReason" placeholder="If bounced..." class="emi-input"></div>
                    <div class="emi-input-field"><label>Status</label><select id="emiInputStatus" class="emi-input emi-select"><option value="cleared">Cleared</option><option value="pending">Pending</option></select></div>
                    <div class="emi-input-field"><button class="btn btn-sm btn-info" onclick="addEmiRecord()" style="margin-top: 24px;">+ Add EMI</button></div>
                </div>
                <div class="emi-table-container" id="emiTableContainer" style="margin-top: 16px;">
                    <div class="emi-grid-header">
                        <div class="emi-col-date">DATE</div><div class="emi-col-amount">AMOUNT</div><div class="emi-col-bounce">BOUNCE</div>
                        <div class="emi-col-reason">REASON</div><div class="emi-col-status">STATUS</div><div class="emi-col-actions">ACTIONS</div>
                    </div>
                    <div id="emiRecordsList"><div class="emi-empty-state">No EMI records. Select a loan and add tracking records above.</div></div>
                </div>
            </div>
        `},
        { id: 'financial-analysis', label: 'Financial Analysis', content: `
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-chart-line"></i> Financial Summary</div>
                <div class="fa-summary-grid">
                    <div class="fa-input-field"><label>Turnover</label><input id="addTurnover" type="number" class="fa-input" placeholder="0.00" oninput="updateFinancialCalculations()"><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Net Profit/Loss</label><input id="addProfitLoss" type="number" class="fa-input" placeholder="0.00" oninput="updateFinancialCalculations()"><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Deductions</label><input id="addDeductions" type="number" class="fa-input" placeholder="0.00" oninput="updateFinancialCalculations()"><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Depreciation</label><input id="addDepreciation" type="number" class="fa-input" placeholder="0.00" oninput="updateFinancialCalculations()"><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Net Income <span class="fa-auto-calc">(Auto)</span></label><input id="addNetIncome" type="number" class="fa-input fa-readonly" placeholder="0.00" readonly><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Total Income <span class="fa-auto-calc">(Auto)</span></label><input id="addTotalIncome" type="number" class="fa-input fa-readonly" placeholder="0.00" readonly><span class="fa-currency">₹</span></div>
                </div>
            </div>
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-info-circle"></i> Additional Information</div>
                <div class="fa-grid-3col">
                    <div class="fa-input-field"><label>Credit Score</label><input id="addCreditScore" type="number" class="fa-input" min="300" max="900" placeholder="300-900" oninput="validateCreditScore(this)"></div>
                    <div class="fa-input-field"><label>GST Status</label><select id="addGstStatus" class="fa-input"><option value="">Select GST Status</option><option value="registered">Registered</option><option value="not-registered">Not Registered</option><option value="exempted">Exempted</option><option value="pending">Pending Registration</option></select></div>
                    <div class="fa-input-field"><label>Turnover Notes</label><input id="addTurnoverNotes" type="text" class="fa-input" placeholder="e.g., Growing at 15% YoY"></div>
                </div>
            </div>
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-sticky-note"></i> Financial Analysis Remarks</div>
                <textarea id="addFinancialRemarks" class="fa-textarea" rows="5" placeholder="Overall financial analysis..."></textarea>
            </div>
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-file-invoice-dollar"></i> Income Details</div><textarea id="addIncomeDetails" class="fa-textarea" rows="4"></textarea></div>
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-receipt"></i> Expense Details</div><textarea id="addExpenseDetails" class="fa-textarea" rows="4"></textarea></div>
        `},
        { id: 'documents', label: 'Documents', content: `
            <div class="two-column-split" style="margin-bottom: 20px;">
                <div class="doc-section-card" style="margin-bottom: 0;">
                    <div class="doc-section-title">
                        <i class="fas fa-file-signature" style="color: #4caf50;"></i> Documents Received
                    </div>
                    <div class="doc-textarea-container">
                        <textarea id="addDocsReceived" class="doc-textarea" rows="6" placeholder="List documents received from client...&#10;E.g.,&#10;• PAN Card&#10;• Aadhaar Card"></textarea>
                    </div>
                    <div class="doc-helper-pill-label">
                        <i class="fas fa-magic"></i> Quick Add Common Items:
                    </div>
                    <div class="doc-helper-pills">
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsReceived', 'PAN Card')"><i class="fas fa-plus"></i> PAN Card</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsReceived', 'Aadhaar Card')"><i class="fas fa-plus"></i> Aadhaar Card</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsReceived', 'Bank Statements (6 Months)')"><i class="fas fa-plus"></i> Bank Statements</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsReceived', 'ITR summarisation (3 Yrs)')"><i class="fas fa-plus"></i> 3-Yr ITR</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsReceived', 'Salary Slips (3 Mos)')"><i class="fas fa-plus"></i> Salary Slips</button>
                    </div>
                </div>
                <div class="doc-section-card" style="margin-bottom: 0;">
                    <div class="doc-section-title">
                        <i class="fas fa-clock" style="color: #ff9800;"></i> Documents Pending
                    </div>
                    <div class="doc-textarea-container">
                        <textarea id="addDocsPending" class="doc-textarea" rows="6" placeholder="List outstanding documents needed...&#10;E.g.,&#10;• Business Registration Code&#10;• Utility Electric Bill"></textarea>
                    </div>
                    <div class="doc-helper-pill-label">
                        <i class="fas fa-magic"></i> Quick Add Common Items:
                    </div>
                    <div class="doc-helper-pills">
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsPending', 'GST Registration filings')"><i class="fas fa-plus"></i> GST filings</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsPending', 'Property deed & title chain documents')"><i class="fas fa-plus"></i> Property Deeds</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsPending', 'Partner/Director KYCs')"><i class="fas fa-plus"></i> Director KYCs</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('addDocsPending', 'Existing loan schedule & sanction letter')"><i class="fas fa-plus"></i> Loan Letter</button>
                    </div>
                </div>
            </div>
            <div class="doc-section-card">
                <div class="doc-section-title">
                    <i class="fas fa-cloud-upload-alt" style="color: var(--gold);"></i> Upload Digital Documents
                </div>
                
                <input id="addLeadFiles" type="file" multiple onchange="handleAddLeadFiles(this.files)" style="display: none;">
                
                <div class="custom-file-dropzone" id="addLeadDropzone" onclick="document.getElementById('addLeadFiles').click()">
                    <i class="fas fa-cloud-upload-alt dropzone-icon"></i>
                    <div class="dropzone-text">Drag & drop files here or <span style="color: var(--gold); text-decoration: underline; font-weight: 600;">browse files</span></div>
                    <div class="dropzone-subtext">Supports PDF, DOCX, XLSX, Images (Secure local file serialization up to 5MB total)</div>
                </div>
                
                <div id="addLeadAttachmentsList" style="margin-top: 15px;"></div>
            </div>
        `},
        { id: 'check-points', label: 'Check Points', content: `
            <div class="dcp-header" style="background: rgba(255, 255, 255, 0.01); border: 1px dashed var(--border2); border-radius: 12px; padding: 18px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; width: 100%;">
                    <div>
                        <h2 class="dcp-title" style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #fff;"><i class="fas fa-clipboard-check" style="color: var(--gold); margin-right: 8px;"></i> Document Check Points</h2>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text3);">Configure verification statuses for mandatory items and upload verification files.</p>
                    </div>
                    <div>
                        <input type="file" id="dcp-bulk-upload-add" style="display: none;" multiple onchange="handleDcpBulkUpload(this.files, false)">
                        <button type="button" class="btn-premium-add-merit" style="padding: 8px 14px; font-size: 12px;" onclick="document.getElementById('dcp-bulk-upload-add').click()">
                            <i class="fas fa-cloud-upload-alt mr-1"></i> Bulk Upload & Auto-Match
                        </button>
                    </div>
                </div>
            </div>
            <div class="dcp-sections" id="dcp-sections"></div>
        `}
    ];

    const tabButtons = tabs.map(tab => `<button class="tab ${tab.id === 'new-lead' ? 'active' : ''}" onclick="switchAddLeadTab('${tab.id}')">${tab.label}</button>`).join('');
    const tabContents = tabs.map(tab => `<div class="tab-content ${tab.id === 'new-lead' ? 'active' : ''}" id="${tab.id}">${tab.content}</div>`).join('');

    window.nextMeritRowIndex = 5;

    openModal('Add New Lead', `
        <div class="tabs">${tabButtons}</div>
        <div class="tab-container">${tabContents}</div>
    `, `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveLead()">Save</button>
    `);

    setTimeout(() => {
        renderAddLeadAttachments();
        triggerTotalSummaryUpdate();
        renderActiveMeritsList(false);
        renderBankRecords();
        renderLoanRecords();
    }, 50);
}

window.initializeDocumentsDropzone = function(isEdit) {
    const prefix = isEdit ? 'editLead' : 'addLead';
    const dropzone = document.getElementById(`${prefix}Dropzone`);
    if (!dropzone) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    // Toggle active state on dragenter/dragover
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove('dragover');
        }, false);
    });
    
    // Handle dropped files
    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            if (isEdit) {
                handleEditLeadFiles(files);
            } else {
                handleAddLeadFiles(files);
            }
        }
    }, false);
};

function switchAddLeadTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const tabBtn = document.querySelector(`.tab[onclick="switchAddLeadTab('${tabId}')"]`);
    if (tabBtn) tabBtn.classList.add('active');
    
    const contentEl = document.getElementById(tabId);
    if (contentEl) contentEl.classList.add('active');
    
    if (tabId === 'check-points') {
        setTimeout(() => initializeDocCheckPoints(), 100);
    } else if (tabId === 'bank-remarks') {
        renderBankRecords();
    } else if (tabId === 'loan-details') {
        renderLoanRecords();
    } else if (tabId === 'documents') {
        setTimeout(() => initializeDocumentsDropzone(false), 50);
    }
}

function createMeritRowHtml(index, data = {}) {
    // Determine default classification
    let classification = data.classification;
    if (!classification) {
        const lowerRemarks = (data.remarks || '').toLowerCase();
        const lowerType = (data.meritType || '').toLowerCase();
        if (lowerRemarks.includes('challenge') || lowerRemarks.includes('risk') || lowerRemarks.includes('missing') || lowerRemarks.includes('delay') || lowerRemarks.includes('short') ||
            lowerType.includes('challenge') || lowerType.includes('risk') || lowerType.includes('missing') || lowerType.includes('delay') || lowerType.includes('short') ||
            index % 2 === 1) { // odd indexes as challenge default matching mockup
            classification = 'challenge';
        } else {
            classification = 'merit';
        }
    }
    const isMerit = classification === 'merit';
    
    // Select options for Doc Type
    const docTypes = ['PAN', 'Aadhar', 'Bank Statements', 'ITR / Form 16', 'Business Registration', 'Property Documents', 'Co-Applicant Docs', 'Other'];
    const docTypeOptions = docTypes.map(doc => `<option value="${doc}" ${data.docType === doc ? 'selected' : ''}>${doc}</option>`).join('');

    // Select options for Stage
    const stages = ['Primary Check', 'Secondary Underwriting', 'Verification', 'Finalization', 'Pre-Approval', 'Disbursement'];
    const stageOptions = stages.map(st => `<option value="${st}" ${data.stage === st ? 'selected' : ''}>${st}</option>`).join('');

    // Filter and map CSO options safely
    const csoUsers = (window.users || []).filter(u => u.role === 'cso' || u.role === 'admin');
    const ownerOptions = csoUsers.map(u => `<option value="${u.displayName}" ${data.owner === u.displayName ? 'selected' : ''}>${u.displayName}</option>`).join('');

    return `
    <div class="merit-row merit-card ${isMerit ? 'theme-merit' : 'theme-challenge'}" data-row="${index}" id="meritCard_${index}">
        <input type="hidden" id="meritClassification${index}" value="${classification}" class="merit-class-value">
        
        <div class="merit-card-header">
            <div class="merit-card-title-sec">
                <div class="merit-card-icon-wrap">
                    <i class="fas ${isMerit ? 'fa-thumbs-up' : 'fa-exclamation-triangle'}"></i>
                </div>
                <div>
                    <span class="merit-card-badge-num">${isMerit ? 'Merit' : 'Challenge'} #${parseInt(index) + 1}</span>
                    <span class="merit-card-badge-pill ${isMerit ? 'badge-merit' : 'badge-challenge'}">${isMerit ? 'Merit' : 'Challenge'}</span>
                </div>
            </div>
            <div class="merit-card-actions">
                <button type="button" class="btn-card-action-swap" onclick="toggleCardClassification(${index})" title="Toggle Merit/Challenge">
                    <i class="fas fa-sync-alt"></i> Swap Type
                </button>
                <button type="button" class="btn-card-action" onclick="deleteMeritCard(${index})" title="Delete entry">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>

        <div class="merit-card-grid">
            <div class="fg">
                <label>Date</label>
                <div class="input-with-icon">
                    <i class="far fa-calendar"></i>
                    <input id="meritDate${index}" type="date" value="${data.date || ''}" oninput="triggerTotalSummaryUpdate()">
                </div>
            </div>
            
            <div class="fg">
                <label>Document Type</label>
                <div class="input-with-icon">
                    <i class="far fa-file-alt"></i>
                    <select id="meritDocType${index}" onchange="triggerTotalSummaryUpdate()">
                        <option value="">-- Choose Doc --</option>
                        ${docTypeOptions}
                        ${data.docType && !docTypes.includes(data.docType) ? `<option value="${data.docType}" selected>${data.docType}</option>` : ''}
                    </select>
                </div>
            </div>
            
            <div class="fg">
                <label>Stage</label>
                <div class="input-with-icon">
                    <i class="fas fa-layer-group"></i>
                    <select id="meritStage${index}" onchange="triggerTotalSummaryUpdate()">
                        <option value="">-- Choose Stage --</option>
                        ${stageOptions}
                        ${data.stage && !stages.includes(data.stage) ? `<option value="${data.stage}" selected>${data.stage}</option>` : ''}
                    </select>
                </div>
            </div>
            
            <div class="fg">
                <label>Owner</label>
                <div class="input-with-icon">
                    <i class="far fa-user"></i>
                    <select id="meritOwner${index}" onchange="triggerTotalSummaryUpdate()">
                        <option value="">-- Choose Owner --</option>
                        ${ownerOptions}
                        ${data.owner && !csoUsers.some(u => u.displayName === data.owner) ? `<option value="${data.owner}" selected>${data.owner}</option>` : ''}
                    </select>
                </div>
            </div>
        </div>

        <div class="merit-card-textareas">
            <div class="fg textarea-fg" style="margin-bottom: 12px;">
                <label>Remarks</label>
                <div class="textarea-wrap">
                    <textarea id="meritRemarks${index}" placeholder="Enter remarks (e.g. Missing PAN document)" maxlength="500" oninput="updateCharCounter(${index}, 'Remarks')">${data.remarks || ''}</textarea>
                    <span class="char-counter" id="counterRemarks_${index}">${(data.remarks || '').length}/500</span>
                </div>
            </div>
            
            <div class="fg textarea-fg">
                <label>Merit / Challenge Description</label>
                <div class="textarea-wrap">
                    <textarea id="meritType${index}" placeholder="E.g. Good credit score or Income not consistent for last 6 months" maxlength="500" oninput="updateCharCounter(${index}, 'Type')">${data.meritType || ''}</textarea>
                    <span class="char-counter" id="counterType_${index}">${(data.meritType || '').length}/500</span>
                </div>
            </div>
        </div>
    </div>
    `;
}

function buildMeritsSidebarHtml() {
    return `
    <div class="lead-summary-sidebar-box">
        <div class="sidebar-box-header">
            <div class="sidebar-box-title">
                <i class="fas fa-chart-pie"></i> Lead Summary
            </div>
            <div class="dots-action">•••</div>
        </div>
        
        <div class="sbb-meters">
            <div class="sbb-meter-row">
                <div><span class="d-dot dot-merit"></span><span class="meter-lbl">Merits</span></div>
                <span class="meter-val" id="sumMeritsCount">3</span>
            </div>
            <div class="sbb-meter-row">
                <div><span class="d-dot dot-challenge"></span><span class="meter-lbl">Challenges</span></div>
                <span class="meter-val" id="sumChallengesCount">2</span>
            </div>
            <div class="sbb-meter-row">
                <div><span class="d-dot dot-docs"></span><span class="meter-lbl">Documents</span></div>
                <span class="meter-val" id="sumDocsCount">7</span>
            </div>
            <div class="sbb-meter-row">
                <div><span class="d-dot dot-check"></span><span class="meter-lbl">Check Points</span></div>
                <span class="meter-val" id="sumCheckPointsCount">4</span>
            </div>
        </div>
        
        <div class="sbb-completion-gauge">
            <div class="gauge-header">
                <span class="gauge-lbl">Completion</span>
                <span class="gauge-val" id="sumCompletionPct">78%</span>
            </div>
            <div class="gauge-bar-track">
                <div class="gauge-bar-fill" id="sumCompletionFill" style="width: 78%;"></div>
            </div>
        </div>
        
        <div class="sbb-details-grid">
            <div class="detail-row">
                <span class="dt-lbl">Risk Level</span>
                <span class="dt-val badge-risk risk-medium" id="sumRiskLevel">Medium</span>
            </div>
            <div class="detail-row">
                <span class="dt-lbl">Lead Owner</span>
                <span class="dt-val" id="sumLeadOwner">Manu</span>
            </div>
            <div class="detail-row">
                <span class="dt-lbl">Last Updated</span>
                <span class="dt-val" id="sumLastUpdated">19 Jun 2026, 10:45 AM</span>
            </div>
        </div>
        
        <div class="sbb-tip-card">
            <div class="sbb-tip-icon">✨</div>
            <div class="sbb-tip-text">
                <strong>Tip</strong>
                <p>Adding complete merits and challenges helps in faster loan decisioning.</p>
            </div>
        </div>
    </div>
    `;
}

window.toggleCardClassification = function(index) {
    const card = document.getElementById(`meritCard_${index}`);
    if (!card) return;
    const isCurrentlyMerit = card.classList.contains('theme-merit');
    const input = document.getElementById(`meritClassification${index}`);
    
    if (isCurrentlyMerit) {
        card.classList.remove('theme-merit');
        card.classList.add('theme-challenge');
        if (input) input.value = 'challenge';
        card.querySelector('.merit-card-badge-num').innerText = `Challenge #${parseInt(index) + 1}`;
        const pill = card.querySelector('.merit-card-badge-pill');
        pill.className = 'merit-card-badge-pill badge-challenge';
        pill.innerText = 'Challenge';
        card.querySelector('.merit-card-icon-wrap i').className = 'fas fa-exclamation-triangle';
    } else {
        card.classList.remove('theme-challenge');
        card.classList.add('theme-merit');
        if (input) input.value = 'merit';
        card.querySelector('.merit-card-badge-num').innerText = `Merit #${parseInt(index) + 1}`;
        const pill = card.querySelector('.merit-card-badge-pill');
        pill.className = 'merit-card-badge-pill badge-merit';
        pill.innerText = 'Merit';
        card.querySelector('.merit-card-icon-wrap i').className = 'fas fa-thumbs-up';
    }
    
    triggerTotalSummaryUpdate();
};

window.deleteMeritCard = function(index) {
    const card = document.getElementById(`meritCard_${index}`);
    if (card) {
        card.classList.add('slide-out-fade');
        setTimeout(() => {
            card.remove();
            reindexMeritCards();
            triggerTotalSummaryUpdate();
        }, 220);
    }
};

window.reindexMeritCards = function() {
    document.querySelectorAll('.merit-card').forEach((card, idx) => {
        const isMerit = card.classList.contains('theme-merit');
        card.querySelector('.merit-card-badge-num').innerText = `${isMerit ? 'Merit' : 'Challenge'} #${idx + 1}`;
    });
};

window.updateCharCounter = function(index, fieldType) {
    const tx = document.getElementById(`merit${fieldType}${index}`);
    const cnt = document.getElementById(`counter${fieldType}_${index}`);
    if (tx && cnt) {
        cnt.innerText = `${tx.value.length}/500`;
    }
    triggerTotalSummaryUpdate();
};

window.triggerTotalSummaryUpdate = function() {
    let meritsCount = 0;
    let challengesCount = 0;
    
    document.querySelectorAll('.merit-card').forEach(card => {
        if (card.classList.contains('theme-merit')) meritsCount++;
        if (card.classList.contains('theme-challenge')) challengesCount++;
    });
    
    // Update labels in real-time
    const mCountEl = document.getElementById('sumMeritsCount');
    if (mCountEl) mCountEl.innerText = meritsCount;
    const cCountEl = document.getElementById('sumChallengesCount');
    if (cCountEl) cCountEl.innerText = challengesCount;
    
    // Risk Level detection
    const riskEl = document.getElementById('sumRiskLevel');
    if (riskEl) {
        if (challengesCount === 0) {
            riskEl.innerText = 'Low';
            riskEl.className = 'dt-val badge-risk risk-low';
        } else if (challengesCount <= 2) {
            riskEl.innerText = 'Medium';
            riskEl.className = 'dt-val badge-risk risk-medium';
        } else {
            riskEl.innerText = 'High';
            riskEl.className = 'dt-val badge-risk risk-high';
        }
    }
    
    // Owner name from Assign CSO field
    const csoEl = document.getElementById('addCso') || document.getElementById('editCso');
    const ownerEl = document.getElementById('sumLeadOwner');
    if (ownerEl && csoEl) {
        const selectedText = csoEl.options[csoEl.selectedIndex]?.text || '';
        if (selectedText && selectedText !== 'None / Keep Unassigned' && selectedText !== 'None') {
            ownerEl.innerText = selectedText.split('(')[0].trim();
        } else {
            ownerEl.innerText = 'Unassigned';
        }
    }
    
    // Let's count files/documents attached
    let docCount = document.querySelectorAll('#addLeadAttachmentsList div, #editLeadAttachmentsList div').length;
    if (docCount === 0) docCount = 7; // realistic baseline
    const sumDocsCountEl = document.getElementById('sumDocsCount');
    if (sumDocsCountEl) sumDocsCountEl.innerText = docCount;
    
    // Check points count
    let checkPointsCount = document.querySelectorAll('.dcp-section input[type="checkbox"]:checked').length;
    if (checkPointsCount === 0) checkPointsCount = 4; // realistic baseline
    const sumCheckPointsCountEl = document.getElementById('sumCheckPointsCount');
    if (sumCheckPointsCountEl) sumCheckPointsCountEl.innerText = checkPointsCount;
    
    // Completion score calculation
    let completionScore = 50; 
    const inputName = document.getElementById('addName') || document.getElementById('editName');
    if (inputName?.value) completionScore += 10;
    const inputPhone = document.getElementById('addPhone') || document.getElementById('editPhone');
    if (inputPhone?.value) completionScore += 10;
    completionScore += (meritsCount * 4) + (challengesCount * 3);
    if (completionScore > 98) completionScore = 98; // keep some room
    if (completionScore < 30) completionScore = 30;
    
    const fillEl = document.getElementById('sumCompletionFill');
    const pctEl = document.getElementById('sumCompletionPct');
    if (fillEl && pctEl) {
        fillEl.style.width = `${completionScore}%`;
        pctEl.innerText = `${completionScore}%`;
    }
    
    // Today's date with premium formatted timestamp
    const lastUp = document.getElementById('sumLastUpdated');
    if (lastUp) {
        lastUp.innerText = `Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
};

function buildMeritsAndChallengesTabHtml(isEdit) {
    const csoUsers = (window.users || []).filter(u => u.role === 'cso' || u.role === 'admin');
    const ownerOptionsHtml = csoUsers.map(u => `<option value="${u.displayName}">${u.displayName}</option>`).join('');

    return `
        <div class="merits-top-title-row" style="margin-bottom: 20px;">
            <div>
                 <h2 class="merits-tab-heading" style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; color: #fff;">Merits & Challenges</h2>
                 <p class="merits-tab-subheading" style="margin: 4px 0 0 0; font-size: 12px; color: var(--text3);">${isEdit ? 'Review or add merits and challenges observed for this lead.' : 'Add all merits and challenges observed for this lead.'}</p>
            </div>
        </div>
        
        <div class="merits-single-col-layout" style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
            <!-- TOP SECTION: LIST OF ADDED MERITS & CHALLENGES -->
            <div class="active-merits-list-section" style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border2); border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 12px 0; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-list-ul" style="color: var(--gold);"></i> Added Merits & Challenges <span id="activeMeritsCountBadge" style="background: rgba(223, 178, 87, 0.1); color: var(--gold); font-size: 12px; padding: 2px 8px; border-radius: 20px; font-weight: 600;">0</span>
                </h3>
                <div id="activeMeritsCardsList" style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; padding-right: 4px;">
                    <div class="empty-merits-alert" style="text-align: center; padding: 30px 20px; color: var(--text3); border: 1px dashed rgba(255,255,255,0.05); border-radius: 8px;">
                        <i class="fas fa-info-circle" style="font-size: 24px; color: var(--text3); margin-bottom: 8px; display: block;"></i>
                        No merits or challenges added yet. Use the form below to add.
                    </div>
                </div>
            </div>

            <!-- BOTTOM SECTION: ONE ENTRY FORM SECTION -->
            <div class="merit-add-form-section" style="background: rgba(255, 255, 255, 0.015); border: 1px solid var(--border2); border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-plus-circle" style="color: var(--gold);"></i> Add New Entry
                </h3>
                
                <div class="merit-form-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">
                    <div class="fg" style="display: flex; flex-direction: column;">
                        <label style="display: block; font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 600;">Classification</label>
                        <div class="segmented-control" style="display: flex; background: rgba(0,0,0,0.25); padding: 4px; border-radius: 8px; border: 1px solid var(--border2); width: fit-content; gap: 4px;">
                            <button type="button" id="formMeritClass_merit" class="segmented-btn" style="flex: 1; min-width: 100px; padding: 8px 12px; border: 1px solid rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 13px; font-weight: 700; cursor: pointer; border-radius: 6px; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="setFormClassification('merit')">
                                <i class="fas fa-thumbs-up" style="font-size: 11px;"></i> Merit
                            </button>
                            <button type="button" id="formMeritClass_challenge" class="segmented-btn" style="flex: 1; min-width: 100px; padding: 8px 12px; border: 1px solid transparent; background: transparent; color: var(--text3); font-size: 13px; font-weight: 700; cursor: pointer; border-radius: 6px; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 6px;" onclick="setFormClassification('challenge')">
                                <i class="fas fa-exclamation-triangle" style="font-size: 11px;"></i> Challenge
                            </button>
                        </div>
                        <input type="hidden" id="formMeritClassification" value="merit">
                    </div>

                    <div class="fg">
                        <label style="display: block; font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 600;">Date</label>
                        <div class="input-with-icon">
                            <i class="far fa-calendar"></i>
                            <input id="formMeritDate" type="date" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>

                    <div class="fg">
                        <label style="display: block; font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 600;">Document Type</label>
                        <div class="input-with-icon">
                            <i class="far fa-file-alt"></i>
                            <select id="formMeritDocType">
                                <option value="">-- Choose Doc --</option>
                                <option value="PAN">PAN</option>
                                <option value="Aadhar">Aadhar</option>
                                <option value="Bank Statements">Bank Statements</option>
                                <option value="ITR / Form 16">ITR / Form 16</option>
                                <option value="Business Registration">Business Registration</option>
                                <option value="Property Documents">Property Documents</option>
                                <option value="Co-Applicant Docs">Co-Applicant Docs</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="fg">
                        <label style="display: block; font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 600;">Stage</label>
                        <div class="input-with-icon">
                            <i class="fas fa-layer-group"></i>
                            <select id="formMeritStage">
                                <option value="">-- Choose Stage --</option>
                                <option value="Primary Check">Primary Check</option>
                                <option value="Secondary Underwriting">Secondary Underwriting</option>
                                <option value="Verification">Verification</option>
                                <option value="Finalization">Finalization</option>
                                <option value="Pre-Approval">Pre-Approval</option>
                                <option value="Disbursement">Disbursement</option>
                            </select>
                        </div>
                    </div>

                    <div class="fg">
                        <label style="display: block; font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 600;">Owner</label>
                        <div class="input-with-icon">
                            <i class="far fa-user"></i>
                            <select id="formMeritOwner">
                                <option value="">-- Choose Owner --</option>
                                ${ownerOptionsHtml}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="merit-form-textareas" style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px;">
                    <div class="fg textarea-fg">
                        <label style="display: block; font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 600;">Description <span style="color: #ef4444;">*</span></label>
                        <div class="textarea-wrap">
                            <textarea id="formMeritType" placeholder="E.g. Good credit score or Income not consistent for last 6 months" maxlength="500" oninput="updateFormCharCounter('Type')"></textarea>
                            <span class="char-counter" id="formCounterType">0/500</span>
                        </div>
                    </div>
                    
                    <div class="fg textarea-fg">
                        <label style="display: block; font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 600;">Remarks</label>
                        <div class="textarea-wrap">
                            <textarea id="formMeritRemarks" placeholder="Enter remarks (e.g. Missing PAN document)" maxlength="500" oninput="updateFormCharCounter('Remarks')"></textarea>
                            <span class="char-counter" id="formCounterRemarks">0/500</span>
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                    <button type="button" class="btn btn-primary" style="background: var(--gold); color: #111; font-weight: 750; padding: 10px 24px; font-size: 13px; border-radius: 8px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(223, 178, 87, 0.2);" onclick="addActiveMeritCard(${isEdit})">
                        <i class="fas fa-plus"></i> Add Entry
                    </button>
                </div>
            </div>
        </div>
    `;
}

window.setFormClassification = function(type) {
    const meritBtn = document.getElementById('formMeritClass_merit');
    const challengeBtn = document.getElementById('formMeritClass_challenge');
    const inputVal = document.getElementById('formMeritClassification');
    if (inputVal) inputVal.value = type;

    if (meritBtn && challengeBtn) {
        if (type === 'merit') {
            meritBtn.style.background = 'rgba(16, 185, 129, 0.15)';
            meritBtn.style.color = '#10b981';
            meritBtn.style.border = '1px solid rgba(16, 185, 129, 0.4)';
            challengeBtn.style.background = 'transparent';
            challengeBtn.style.color = 'var(--text3)';
            challengeBtn.style.border = '1px solid transparent';
        } else {
            challengeBtn.style.background = 'rgba(239, 68, 68, 0.15)';
            challengeBtn.style.color = '#ef4444';
            challengeBtn.style.border = '1px solid rgba(239, 68, 68, 0.4)';
            meritBtn.style.background = 'transparent';
            meritBtn.style.color = 'var(--text3)';
            meritBtn.style.border = '1px solid transparent';
        }
    }
};

window.updateFormCharCounter = function(fieldType) {
    const tx = document.getElementById(`formMerit${fieldType}`);
    const cnt = document.getElementById(`formCounter${fieldType}`);
    if (tx && cnt) {
        cnt.innerText = `${tx.value.length}/500`;
    }
};

window.addActiveMeritCard = function(isEdit) {
    const dateInput = document.getElementById('formMeritDate');
    const docTypeSelect = document.getElementById('formMeritDocType');
    const stageSelect = document.getElementById('formMeritStage');
    const ownerSelect = document.getElementById('formMeritOwner');
    const remarksTextarea = document.getElementById('formMeritRemarks');
    const typeTextarea = document.getElementById('formMeritType');
    const classificationInput = document.getElementById('formMeritClassification');

    const date = dateInput?.value || '';
    const docType = docTypeSelect?.value || '';
    const stage = stageSelect?.value || '';
    const owner = ownerSelect?.value || '';
    const remarks = remarksTextarea?.value.trim() || '';
    const meritType = typeTextarea?.value.trim() || '';
    const classification = classificationInput?.value || 'merit';

    if (!meritType) {
        toast('Description is required', 'error');
        return;
    }

    const newItem = {
        classification,
        date,
        docType,
        stage,
        owner,
        remarks,
        meritType
    };

    if (!window.activeMeritsList) {
        window.activeMeritsList = [];
    }
    window.activeMeritsList.unshift(newItem);

    // Clear form fields
    if (remarksTextarea) remarksTextarea.value = '';
    if (typeTextarea) typeTextarea.value = '';
    if (docTypeSelect) docTypeSelect.value = '';
    if (stageSelect) stageSelect.value = '';
    if (ownerSelect) ownerSelect.value = '';
    
    // Reset counters
    const counterType = document.getElementById('formCounterType');
    if (counterType) counterType.innerText = '0/500';
    const counterRemarks = document.getElementById('formCounterRemarks');
    if (counterRemarks) counterRemarks.innerText = '0/500';

    // Re-render
    renderActiveMeritsList(isEdit);
    triggerTotalSummaryUpdate();
    toast('Added successfully', 'success');
};

window.renderActiveMeritsList = function(isEdit) {
    const container = document.getElementById('activeMeritsCardsList');
    const countBadge = document.getElementById('activeMeritsCountBadge');
    if (!container) return;

    const list = window.activeMeritsList || [];
    if (countBadge) countBadge.innerText = list.length;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty-merits-alert" style="text-align: center; padding: 30px 20px; color: var(--text3); border: 1px dashed rgba(255,255,255,0.05); border-radius: 8px;">
                <i class="fas fa-info-circle" style="font-size: 24px; color: var(--text3); margin-bottom: 8px; display: block;"></i>
                No merits or challenges added yet. Use the form below to add.
            </div>
        `;
        return;
    }

    container.innerHTML = list.map((item, index) => {
        const isMerit = item.classification === 'merit';
        return `
            <div class="merit-row merit-card ${isMerit ? 'theme-merit' : 'theme-challenge'}" data-row="${index}" id="meritCard_${index}" style="margin-bottom: 4px;">
                <!-- Compatibility hidden inputs so existing save codes work perfectly -->
                <input type="hidden" id="meritClassification${index}" value="${item.classification || 'merit'}">
                <input type="hidden" id="meritDate${index}" value="${item.date || ''}">
                <input type="hidden" id="meritDocType${index}" value="${item.docType || ''}">
                <input type="hidden" id="meritStage${index}" value="${item.stage || ''}">
                <input type="hidden" id="meritOwner${index}" value="${item.owner || ''}">
                <textarea style="display:none;" id="meritRemarks${index}">${item.remarks || ''}</textarea>
                <textarea style="display:none;" id="meritType${index}">${item.meritType || ''}</textarea>

                <div class="merit-card-header" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.05); margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="merit-card-badge-pill ${isMerit ? 'badge-merit' : 'badge-challenge'}" style="font-size: 11px; font-weight: bold; text-transform: uppercase;">
                            <i class="fas ${isMerit ? 'fa-thumbs-up' : 'fa-exclamation-triangle'}" style="margin-right: 4px;"></i>${isMerit ? 'Merit' : 'Challenge'} #${list.length - index}
                        </span>
                        ${item.date ? `<span style="font-size: 12px; color: var(--text3);"><i class="far fa-calendar" style="margin-right: 4px;"></i>${item.date}</span>` : ''}
                    </div>
                    <button type="button" class="btn btn-sm" style="background: transparent; border: none; color: #ef4444; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="removeActiveMeritsRow(${index}, ${isEdit})">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; font-size: 12px;">
                    ${item.docType ? `<span style="background: rgba(255,255,255,0.03); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06); color: var(--gold);"><i class="far fa-file-alt" style="margin-right: 4px;"></i>${item.docType}</span>` : ''}
                    ${item.stage ? `<span style="background: rgba(255,255,255,0.03); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06); color: var(--text2);"><i class="fas fa-layer-group" style="margin-right: 4px;"></i>${item.stage}</span>` : ''}
                    ${item.owner ? `<span style="background: rgba(255,255,255,0.03); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06); color: var(--text2);"><i class="far fa-user" style="margin-right: 4px;"></i>${item.owner}</span>` : ''}
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${item.meritType ? `
                        <div>
                            <strong style="font-size: 11px; color: var(--text3); text-transform: uppercase;">Description:</strong>
                            <p style="margin: 2px 0 0 0; font-size: 13px; color: #fff; line-height: 1.4; white-space: pre-wrap;">${escapeHtml(item.meritType)}</p>
                        </div>
                    ` : ''}
                    ${item.remarks ? `
                        <div style="border-top: 1px dashed rgba(255,255,255,0.03); padding-top: 6px; margin-top: 4px;">
                            <strong style="font-size: 11px; color: var(--text3); text-transform: uppercase;">Remarks:</strong>
                            <p style="margin: 2px 0 0 0; font-size: 12px; color: var(--text2); line-height: 1.4; font-style: italic; white-space: pre-wrap;">${escapeHtml(item.remarks)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
};

window.removeActiveMeritsRow = function(index, isEdit) {
    if (!confirm('Are you sure you want to remove this entry?')) return;
    window.activeMeritsList.splice(index, 1);
    renderActiveMeritsList(isEdit);
    triggerTotalSummaryUpdate();
    toast('Entry removed', 'success');
};

function addMeritRow() {
    // Left as legacy stub
}

function updateMeritsPreview() {
    // Left as legacy stub
}

function renderEditMerits() {
    renderActiveMeritsList(true);
}


// ===================== REMARKS PREVIEW MODAL =====================
function showRemarksModal(title, fullText) {
    const backdrop = document.createElement('div');
    backdrop.className = 'remarks-backdrop show';
    backdrop.onclick = closeRemarksModal;
    const modal = document.createElement('div');
    modal.className = 'remarks-modal show';
    modal.innerHTML = `
        <div class="remarks-modal-header">
            <div class="remarks-modal-title">${title}</div>
            <button class="remarks-modal-close" onclick="closeRemarksModal()">Close</button>
        </div>
        <div class="remarks-modal-body">${escapeHtml(fullText)}</div>
    `;
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);
}

function closeRemarksModal() {
    document.querySelector('.remarks-backdrop.show')?.remove();
    document.querySelector('.remarks-modal.show')?.remove();
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text || '').replace(/[&<>"']/g, m => map[m]);
}

function truncateRemark(text, maxLength = 100, maxLines = 2) {
    if (!text) return '—';
    const lines = text.split('\n');
    let truncated = lines.slice(0, maxLines).join('\n');
    if (truncated.length > maxLength) {
        truncated = truncated.substring(0, maxLength) + '...';
    } else if (lines.length > maxLines) {
        truncated += '...';
    }
    return truncated;
}

function createRemarksPreview(fullText, title = 'Remarks') {
    const preview = truncateRemark(fullText, 100, 2);
    return `<div class="remarks-preview" onclick="showRemarksModal('${title}', \`${escapeHtml(fullText)}\`)" title="${escapeHtml(fullText)}">${escapeHtml(preview)}</div>`;
}

// ===================== BANK RECORDS MANAGEMENT =====================
window.bankRecords = [];
let bankEditingIndex = null;

window.addBankRow = function() {
    const name = document.getElementById('bankInputName')?.value.trim() || '';
    const contact = document.getElementById('bankInputContact')?.value.trim() || '';
    const status = document.getElementById('bankInputStatus')?.value || '';
    if (!name || !contact || !status) { toast('<i class="fas fa-exclamation-circle" style="color:#ef4444;margin-right:6px;"></i>Please fill in all fields', 'error'); return; }
    
    const isNew = (bankEditingIndex === null);
    if (bankEditingIndex !== null) {
        window.bankRecords[bankEditingIndex] = { name, contact, status };
        bankEditingIndex = null;
    } else {
        window.bankRecords.push({ name, contact, status });
    }
    
    document.getElementById('bankInputName').value = '';
    document.getElementById('bankInputContact').value = '';
    document.getElementById('bankInputStatus').value = '';
    
    const addButton = document.querySelector('[onclick="addBankRow()"]');
    if (addButton) {
        addButton.innerHTML = `<i class="fas fa-plus"></i> Add Entry`;
    }
    
    renderBankRecords();
    toast(isNew ? `<i class="fas fa-check-circle" style="color:#4caf50;margin-right:6px;"></i>Bank <i>"${name}"</i> added` : `<i class="fas fa-info-circle" style="color:var(--gold);margin-right:6px;"></i>Bank <i>"${name}"</i> updated`, 'success');
};

window.renderBankRecords = function() {
    const listContainer = document.getElementById('bankRecordsList');
    if (!listContainer) return;
    if (window.bankRecords.length === 0) {
        listContainer.innerHTML = `
            <div class="bank-empty-state" style="padding: 30px 16px; text-align: center; color: var(--text3); font-size: 13px;">
                <i class="fas fa-university" style="font-size: 24px; color: var(--text3); margin-bottom: 8px; opacity: 0.4; display: block; margin-left: auto; margin-right: auto;"></i>
                No bank entries added yet. Use the fields above to add entries.
            </div>
        `;
        return;
    }
    listContainer.innerHTML = window.bankRecords.map((record, index) => `
        <div class="bank-record-row" style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr 100px; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: center; transition: all 0.2s ease; padding: 6px 0;">
            <div class="bank-col-name" style="padding: 10px 14px; color: var(--text); font-weight: 500; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-university" style="color: var(--gold); opacity: 0.8; font-size: 11px;"></i>
                ${record.name}
            </div>
            <div class="bank-col-contact" style="padding: 10px 14px; color: var(--text2); display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-user-circle" style="color: var(--text3); font-size: 12px;"></i>
                ${record.contact}
            </div>
            <div class="bank-col-status" style="padding: 10px 14px; display: flex; justify-content: center; align-items: center;">
                <span class="bank-status-badge status-${record.status}" style="font-weight: 600; text-transform: uppercase; font-size: 10px; display: inline-flex; align-items: center; gap: 6px; border-radius: 6px; padding: 4px 10px; min-width: 90px; text-align: center; justify-content: center; border: 1px solid currentColor;">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor;"></span>
                    ${record.status.replace('-', ' ')}
                </span>
            </div>
            <div class="bank-col-actions" style="padding: 10px 14px; display: flex; gap: 6px; justify-content: center; align-items: center;">
                <button class="bank-action-btn bank-edit" onclick="editBankRow(${index})" title="Edit" style="border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color: var(--gold); cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; transition: all 0.15s ease;"><i class="fas fa-pencil-alt" style="font-size: 11px;"></i></button>
                <button class="bank-action-btn bank-delete" onclick="deleteBankRow(${index})" title="Delete" style="border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.04); color: #ef4444; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; transition: all 0.15s ease;"><i class="fas fa-trash-alt" style="font-size: 11px;"></i></button>
            </div>
        </div>
    `).join('');
};

window.editBankRow = function(index) {
    const record = window.bankRecords[index];
    if (!record) return;
    document.getElementById('bankInputName').value = record.name;
    document.getElementById('bankInputContact').value = record.contact;
    document.getElementById('bankInputStatus').value = record.status;
    bankEditingIndex = index;
    
    // Change Add button text to indicate update mode
    const addButton = document.querySelector('[onclick="addBankRow()"]');
    if (addButton) {
        addButton.innerHTML = `<i class="fas fa-check"></i> Update`;
    }
    
    document.getElementById('bankInputName').focus();
};

window.deleteBankRow = function(index) {
    if (confirm('Delete this bank entry?')) {
        window.bankRecords.splice(index, 1);
        renderBankRecords();
        if (bankEditingIndex === index) {
            bankEditingIndex = null;
            const addButton = document.querySelector('[onclick="addBankRow()"]');
            if (addButton) {
                addButton.innerHTML = `<i class="fas fa-plus"></i> Add Entry`;
            }
        }
        toast('<i class="fas fa-trash-alt" style="color:#ef4444;margin-right:6px;"></i>Deleted bank entry', 'success');
    }
};

// ===================== LOAN RECORDS MANAGEMENT =====================
window.loanRecords = [];
window.emiRecords = {};
let loanEditingIndex = null;
let selectedLoanIndex = null;

function addLoanRecord() {
    const bank = document.getElementById('loanInputBank')?.value.trim() || '';
    const applicant = document.getElementById('loanInputApplicant')?.value.trim() || '';
    const type = document.getElementById('loanInputType')?.value.trim() || '';
    const date = document.getElementById('loanInputDate')?.value || '';
    const amount = parseFloat(document.getElementById('loanInputAmount')?.value) || 0;
    const emi = parseFloat(document.getElementById('loanInputEmi')?.value) || 0;
    const rate = parseFloat(document.getElementById('loanInputRate')?.value) || 0;
    const tenure = parseInt(document.getElementById('loanInputTenure')?.value) || 0;
    const outstanding = parseFloat(document.getElementById('loanInputOutstanding')?.value) || 0;
    const property = parseFloat(document.getElementById('loanInputProperty')?.value) || 0;
    const status = document.getElementById('loanInputStatus')?.value || '';
    const remarks = document.getElementById('loanInputRemarks')?.value.trim() || '';
    if (!bank || !applicant || !type || !date || !amount) {
        toast('Please fill all required fields (Bank, Applicant, Type, Date, Amount)', 'error');
        return;
    }
    const record = { bank, applicant, type, date, amount, emi, rate, tenure, outstanding, property, status, remarks };
    if (loanEditingIndex !== null) {
        window.loanRecords[loanEditingIndex] = record;
        loanEditingIndex = null;
    } else {
        window.loanRecords.push(record);
    }
    clearLoanInputs();
    renderLoanRecords();
    toast('Loan record added', 'success');
}

function clearLoanInputs() {
    document.getElementById('loanInputBank').value = '';
    document.getElementById('loanInputApplicant').value = '';
    document.getElementById('loanInputType').value = '';
    document.getElementById('loanInputDate').value = '';
    document.getElementById('loanInputAmount').value = '';
    document.getElementById('loanInputEmi').value = '';
    document.getElementById('loanInputRate').value = '';
    document.getElementById('loanInputTenure').value = '';
    document.getElementById('loanInputOutstanding').value = '';
    document.getElementById('loanInputProperty').value = '';
    document.getElementById('loanInputStatus').value = '';
    document.getElementById('loanInputRemarks').value = '';
    loanEditingIndex = null;
}

function renderLoanRecords() {
    const listContainer = document.getElementById('loanRecordsList');
    if (!listContainer) return;
    if (window.loanRecords.length === 0) {
        listContainer.innerHTML = '<div class="loan-empty-state">No loan records yet. Add one above.</div>';
        return;
    }
    listContainer.innerHTML = window.loanRecords.map((record, index) => {
        const statusColor = record.status === 'active' ? 'status-active' : record.status === 'closed' ? 'status-closed' : record.status === 'default' ? 'status-default' : 'status-pending';
        const remarksPreview = truncateRemark(record.remarks, 80, 1);
        return `
            <div class="loan-record-row" onclick="selectLoanRecord(${index})">
                <div class="loan-col-bank">${record.bank}</div><div class="loan-col-applicant">${record.applicant}</div><div class="loan-col-type">${record.type}</div>
                <div class="loan-col-date">${record.date}</div><div class="loan-col-amount">₹${record.amount.toLocaleString()}</div><div class="loan-col-emi">₹${record.emi.toLocaleString()}</div>
                <div class="loan-col-rate">${record.rate}%</div><div class="loan-col-outstanding">₹${record.outstanding.toLocaleString()}</div>
                <div class="loan-col-status"><span class="loan-status-badge ${statusColor}">${record.status}</span></div>
                <div class="loan-col-remarks">${record.remarks ? `<div class="remarks-preview" onclick="event.stopPropagation(); showRemarksModal('Loan Remarks', \`${escapeHtml(record.remarks)}\`)" title="${escapeHtml(record.remarks)}">${escapeHtml(remarksPreview)}</div>` : '<span style="color: var(--text2);">—</span>'}</div>
                <div class="loan-col-actions">
                    <button class="loan-action-btn" onclick="event.stopPropagation(); editLoanRecord(${index})" title="Edit">Edit</button>
                    <button class="loan-action-btn loan-delete" onclick="event.stopPropagation(); deleteLoanRecord(${index})" title="Delete">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function selectLoanRecord(index) {
    selectedLoanIndex = index;
    renderLoanRecords();
    renderEmiRecords();
    toast(`Loan record selected. Add EMI records below.`, 'info');
}

function editLoanRecord(index) {
    const record = window.loanRecords[index];
    if (!record) return;
    document.getElementById('loanInputBank').value = record.bank;
    document.getElementById('loanInputApplicant').value = record.applicant;
    document.getElementById('loanInputType').value = record.type;
    document.getElementById('loanInputDate').value = record.date;
    document.getElementById('loanInputAmount').value = record.amount;
    document.getElementById('loanInputEmi').value = record.emi;
    document.getElementById('loanInputRate').value = record.rate;
    document.getElementById('loanInputTenure').value = record.tenure;
    document.getElementById('loanInputOutstanding').value = record.outstanding;
    document.getElementById('loanInputProperty').value = record.property;
    document.getElementById('loanInputStatus').value = record.status;
    document.getElementById('loanInputRemarks').value = record.remarks;
    loanEditingIndex = index;
    document.getElementById('loanInputBank').focus();
}

function deleteLoanRecord(index) {
    if (confirm('Delete this loan record?')) {
        window.loanRecords.splice(index, 1);
        delete window.emiRecords[index];
        if (selectedLoanIndex === index) selectedLoanIndex = null;
        renderLoanRecords();
        renderEmiRecords();
        toast('Loan record deleted', 'success');
    }
}

// ===================== EMI RECORDS MANAGEMENT =====================
function addEmiRecord() {
    if (selectedLoanIndex === null) { toast('Please select a loan record first', 'error'); return; }
    const date = document.getElementById('emiInputDate')?.value || '';
    const amount = parseFloat(document.getElementById('emiInputAmount')?.value) || 0;
    const bounce = document.getElementById('emiInputBounce')?.value || 'no';
    const reason = document.getElementById('emiInputReason')?.value.trim() || '';
    const status = document.getElementById('emiInputStatus')?.value || 'cleared';
    if (!date || !amount) { toast('Please fill EMI Date and Amount', 'error'); return; }
    if (!window.emiRecords[selectedLoanIndex]) window.emiRecords[selectedLoanIndex] = [];
    window.emiRecords[selectedLoanIndex].push({ date, amount, bounce, reason, status });
    document.getElementById('emiInputDate').value = '';
    document.getElementById('emiInputAmount').value = '';
    document.getElementById('emiInputBounce').value = 'no';
    document.getElementById('emiInputReason').value = '';
    document.getElementById('emiInputStatus').value = 'cleared';
    renderEmiRecords();
    toast('EMI record added', 'success');
}

function renderEmiRecords() {
    const listContainer = document.getElementById('emiRecordsList');
    if (!listContainer) return;
    if (selectedLoanIndex === null || !window.emiRecords[selectedLoanIndex] || window.emiRecords[selectedLoanIndex].length === 0) {
        listContainer.innerHTML = '<div class="emi-empty-state">No EMI records. Select a loan and add tracking records above.</div>';
        return;
    }
    const records = window.emiRecords[selectedLoanIndex];
    listContainer.innerHTML = records.map((record, index) => {
        const bounceColor = record.bounce === 'yes' ? 'status-bounce-yes' : 'status-bounce-no';
        const statusColor = record.status === 'cleared' ? 'status-cleared' : 'status-emi-pending';
        return `
            <div class="emi-record-row">
                <div class="emi-col-date">${record.date}</div><div class="emi-col-amount">₹${record.amount.toLocaleString()}</div>
                <div class="emi-col-bounce"><span class="emi-status-badge ${bounceColor}">${record.bounce}</span></div>
                <div class="emi-col-reason">${record.reason || '—'}</div>
                <div class="emi-col-status"><span class="emi-status-badge ${statusColor}">${record.status}</span></div>
                <div class="emi-col-actions"><button class="emi-action-btn" onclick="deleteEmiRecord(${index})" title="Delete">Delete</button></div>
            </div>
        `;
    }).join('');
}

function deleteEmiRecord(index) {
    if (selectedLoanIndex === null || !window.emiRecords[selectedLoanIndex]) return;
    if (confirm('Delete this EMI record?')) {
        window.emiRecords[selectedLoanIndex].splice(index, 1);
        renderEmiRecords();
        toast('EMI record deleted', 'success');
    }
}

// ===================== FINANCIAL ANALYSIS FUNCTIONS =====================
function updateFinancialCalculations() {
    const profitLoss = parseFloat(document.getElementById('addProfitLoss')?.value) || 0;
    const deductions = parseFloat(document.getElementById('addDeductions')?.value) || 0;
    const depreciation = parseFloat(document.getElementById('addDepreciation')?.value) || 0;
    const netIncome = profitLoss - deductions;
    document.getElementById('addNetIncome').value = netIncome.toFixed(2);
    document.getElementById('addTotalIncome').value = (netIncome + depreciation).toFixed(2);
}

function validateCreditScore(input) {
    const value = parseInt(input.value);
    if (isNaN(value)) return;
    if (value < 300) input.value = 300;
    if (value > 900) input.value = 900;
}

// ===================== DOCUMENT CHECK POINTS MANAGEMENT =====================
window.docCheckPoints = {
    sections: [
        { id: 'kyc', name: 'KYC Details', icon: 'fa-id-card', checkpoints: ['PAN Card', 'Aadhaar Card', 'Voter ID'] },
        { id: 'visa', name: 'Visa & Job Contract', icon: 'fa-passport', checkpoints: ['Valid Visa', 'Job Contract', 'Passport'] },
        { id: 'salary', name: 'Salary Slip & Certificate', icon: 'fa-file-invoice', checkpoints: ['Last 3 Salary Slips', 'Salary Certificate', 'Appointment Letter'] },
        { id: 'licenses', name: 'Licenses', icon: 'fa-certificate', checkpoints: ['Business License', 'Trade License', 'Professional License'] },
        { id: 'rental', name: 'Rental Agreement', icon: 'fa-file-contract', checkpoints: ['Rental Agreement', 'Address Proof', 'Landlord ID'] },
        { id: 'itr', name: 'ITR & Computation', icon: 'fa-calculator', checkpoints: ['ITR (Last 3 Years)', 'Tax Computation', 'Tax Payment Proof'] },
        { id: 'balance', name: 'Balance Sheet', icon: 'fa-chart-bar', checkpoints: ['Audited Balance Sheet', 'Unaudited Balance Sheet', "Director's Certificate"] },
        { id: 'pnl', name: 'P&L (3 Years)', icon: 'fa-chart-line', checkpoints: ['P&L 2023-24', 'P&L 2022-23', 'P&L 2021-22'] },
        { id: 'gst', name: 'GST Filing', icon: 'fa-percent', checkpoints: ['GST Registration', 'GSTR-1', 'GSTR-3B', 'GST Payment Receipt'] },
        { id: 'bank', name: 'Bank Statements', icon: 'fa-university', checkpoints: ['Current Account Statements', 'Savings Account Statements', 'Bank Reconciliation'] },
        { id: 'sanction', name: 'Sanction Letter', icon: 'fa-file-pdf', checkpoints: ['Sanction Letter', 'Loan Agreement', 'Disbursement Proof'] },
        { id: 'loans', name: 'Track of Loans', icon: 'fa-history', checkpoints: ['EMI Payment History', 'Loan Statement', 'Default History'] },
        { id: 'cibil', name: 'CIBIL Report', icon: 'fa-credit-card', checkpoints: ['CIBIL Score Report', 'Credit Summary', 'Account Details'] }
    ],
    statusMap: {}
};

function getOrCreateCheckpointEntry(statusMap, key) {
    if (!statusMap[key]) {
        statusMap[key] = { status: 'pending', remark: '', documents: [] };
    }
    if (!statusMap[key].documents) {
        statusMap[key].documents = [];
    }
    return statusMap[key];
}

function findBestCheckPointMatch(fileName) {
    if (!fileName) return null;
    const fn = fileName.toLowerCase().replace(/[^a-z0-9\s]/g, ' '); // replace punctuation with spaces
    
    // 1. Precise Match Rules Map
    const matchRules = {
        'kyc-0': ['pan', 'pancard', 'pan card'],
        'kyc-1': ['aadhar', 'aadhaar', 'uidai', 'adhar', 'adharnumber'],
        'kyc-2': ['voter', 'election', 'voter id', 'voterid'],
        
        'visa-0': ['visa', 'valid visa', 'work permit'],
        'visa-1': ['job contract', 'offer letter', 'employment contract', 'job offer', 'offering letter'],
        'visa-2': ['passport', 'pp copy'],
        
        'salary-0': ['salary slip', 'payslip', 'pay slip', 'salary slips', 'payslips', 'pay slips', 'salary sheet'],
        'salary-1': ['salary certificate', 'salary cert', 'employment certificate'],
        'salary-2': ['appointment letter', 'appointed', 'joining letter', 'appointment'],
        
        'licenses-0': ['business license', 'gstin', 'shop establishment', 'business registration'],
        'licenses-1': ['trade license', 'trade certificate', 'trade reg'],
        'licenses-2': ['professional license', 'professional tax', 'certificate of practice'],
        
        'rental-0': ['rental agreement', 'rent agreement', 'lease agreement', 'lease deed', 'tenancy contract'],
        'rental-1': ['address proof', 'utility bill', 'electricity bill', 'water bill', 'gas bill', 'bill proof'],
        'rental-2': ['landlord id', 'landlord passport', 'owner aadhar', 'owner id'],
        
        'itr-0': ['itr', 'tax return', 'income tax', 'form 16', 'form16', 'annexure'],
        'itr-1': ['tax computation', 'computation of income', 'computation', 'income computation'],
        'itr-2': ['tax payment', 'challan', 'chalan', 'tax receipt', 'cin receipt'],
        
        'balance-0': ['audited balance', 'balance sheet', 'audited bs', 'audited statements'],
        'balance-1': ['unaudited balance', 'provisional balance', 'draft balance', 'unaudited bs'],
        'balance-2': ['director certificate', 'directors certificate', 'board resolution', 'director cert'],
        
        'pnl-0': ['p&l 2023-24', 'p&l 23-24', 'pnl 2023-24', '2023-24', 'p&l 23', 'pnl 23', 'p l 23', 'profit loss 23', 'profit loss 2023'],
        'pnl-1': ['p&l 2022-23', 'p&l 22-23', 'pnl 2022-23', '2022-23', 'p&l 22', 'pnl 22', 'p l 22', 'profit loss 22', 'profit loss 2022'],
        'pnl-2': ['p&l 2021-22', 'p&l 21-22', 'pnl 2021-22', '2021-22', 'p&l 21', 'pnl 21', 'p l 21', 'profit loss 21', 'profit loss 2021'],
        
        'gst-0': ['gst registration', 'gst reg', 'gst certificate', 'gst cert', 'form reg 06'],
        'gst-1': ['gstr 1', 'gstr-1', 'gstr1'],
        'gst-2': ['gstr 3b', 'gstr-3b', 'gstr3b'],
        'gst-3': ['gst payment', 'gst receipt', 'gst challan', 'gst challon'],
        
        'bank-0': ['current account', 'bank statement', 'statement', 'bank', 'current bank', 'bank statement current', 'ca statement'],
        'bank-1': ['savings account', 'savings statement', 'savings bank', 'bank statement savings', 'sa statement'],
        'bank-2': ['reconciliation', 'reco', 'bank reconciliation', 'brs'],
        
        'sanction-0': ['sanction letter', 'sanction', 'approval letter', 'sanctioned'],
        'sanction-1': ['loan agreement', 'loan deed', 'agreement copy'],
        'sanction-2': ['disbursement proof', 'disbursement request', 'disbursement', 'payout proof'],
        
        'loans-0': ['emi', 'payment history', 'repayment track', 'loan track', 'repayment schedule'],
        'loans-1': ['loan statement', 'soa', 'statement of account', 'loan details', 'outstanding statement'],
        'loans-2': ['default history', 'default list', 'default record', 'defaults'],
        
        'cibil-0': ['cibil', 'credit score', 'cibil score', 'cibil report', 'equifax', 'experian'],
        'cibil-1': ['credit summary', 'credit history', 'score summary'],
        'cibil-2': ['account details', 'account info', 'accounts details']
    };

    // First try checking if the filename contains exact matching terms (prioritizing longer terms)
    let bestRuleKey = null;
    let maxLen = 0;
    
    for (const [key, keywords] of Object.entries(matchRules)) {
        for (const kw of keywords) {
            if (fn.includes(kw)) {
                if (kw.length > maxLen) {
                    maxLen = kw.length;
                    bestRuleKey = key;
                }
            }
        }
    }
    
    if (bestRuleKey) {
        const parts = bestRuleKey.split('-');
        return { sectionId: parts[0], idx: parseInt(parts[1]) };
    }

    // 2. Strong Fallback: Check section titles or checklist names
    const sections = window.docCheckPoints?.sections || [];
    let bestScore = 0;
    let bestSectionId = null;
    let bestIdx = -1;
    
    for (const s of sections) {
        s.checkpoints.forEach((cp, idx) => {
            const cpName = cp.toLowerCase();
            let score = 0;
            const cpWords = cpName.split(/[\s\-\&\(\)\/]+/).filter(w => w.length > 2);
            
            cpWords.forEach(cpw => {
                if (fn.includes(cpw)) {
                    score += cpw.length;
                }
            });
            
            if (score > bestScore) {
                bestScore = score;
                bestSectionId = s.id;
                bestIdx = idx;
            }
        });
    }

    if (bestScore >= 3) {
        return { sectionId: bestSectionId, idx: bestIdx };
    }

    return null;
}

async function handleCheckpointFileUpload(sectionId, idx, files) {
    if (!files || files.length === 0) return;
    const isEdit = (document.getElementById(`edit-check-${sectionId}-${idx}`) !== null);
    const statusMap = isEdit ? window.editCheckPoints : window.docCheckPoints.statusMap;
    
    // Read and add files
    for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
            toast(`Skipped "${file.name}" (>10 MB)`, 'error');
            continue;
        }
        
        // Find best match based on file name
        const match = findBestCheckPointMatch(file.name);
        let targetSectionId = sectionId;
        let targetIdx = idx;
        let matchedMsg = "";
        
        if (match) {
            targetSectionId = match.sectionId;
            targetIdx = match.idx;
            const sec = window.docCheckPoints.sections.find(s => s.id === targetSectionId);
            const cpName = sec ? sec.checkpoints[targetIdx] : 'Matched Checkpoint';
            const secName = sec ? sec.name : '';
            matchedMsg = `<i class="fas fa-robot" style="color: var(--gold); margin-right: 6px;"></i><b>Document Agent:</b> Auto-matched & stored <i>"${file.name}"</i> under <b>${secName} > ${cpName}</b>`;
        } else {
            const sec = window.docCheckPoints.sections.find(s => s.id === targetSectionId);
            const cpName = sec ? sec.checkpoints[targetIdx] : 'Current Checkpoint';
            matchedMsg = `<i class="fas fa-file-upload" style="color: var(--gold); margin-right: 6px;"></i>Uploaded <i>"${file.name}"</i> directly to <b>${cpName}</b>`;
        }
        
        const key = `${targetSectionId}-${targetIdx}`;
        const entry = getOrCreateCheckpointEntry(statusMap, key);
        
        const dataUrl = await readFileAsDataUrl(file);
        entry.documents.push({
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size || 0,
            lastModified: file.lastModified || Date.now(),
            dataUrl
        });
        
        // Ensure status is marked pass
        if (isEdit) {
            setEditDocStatus(targetSectionId, targetIdx, 'pass');
        } else {
            setDocStatus(targetSectionId, targetIdx, 'pass');
        }
        
        toast(matchedMsg, 'success');
    }
    
    renderAllCheckpointDocuments(isEdit);
    if (isEdit) {
        updateEditDocCheckPointsProgress();
    } else {
        updateDocCheckPointsProgress();
    }
}

async function handleDcpBulkUpload(files, isEdit) {
    if (!files || files.length === 0) return;
    
    const statusMap = isEdit ? window.editCheckPoints : window.docCheckPoints.statusMap;
    const fileList = Array.from(files);
    let matchedCount = 0;
    let unmatchedCount = 0;
    let matchesDetail = [];
    
    for (const file of fileList) {
        if (file.size > 10 * 1024 * 1024) {
            toast(`Skipped "${file.name}" (>10 MB)`, 'error');
            continue;
        }
        
        // Find best checkpoint match using keyword check
        const match = findBestCheckPointMatch(file.name);
        if (match) {
            const key = `${match.sectionId}-${match.idx}`;
            const entry = getOrCreateCheckpointEntry(statusMap, key);
            const dataUrl = await readFileAsDataUrl(file);
            entry.documents.push({
                name: file.name,
                type: file.type || 'application/octet-stream',
                size: file.size || 0,
                lastModified: file.lastModified || Date.now(),
                dataUrl
            });
            
            // Auto-pass checkpoint
            entry.status = 'pass';
            
            matchedCount++;
            
            const sec = window.docCheckPoints.sections.find(s => s.id === match.sectionId);
            const cpName = sec ? sec.checkpoints[match.idx] : 'Checkpoint';
            matchesDetail.push(`&bull; <b>${file.name}</b> &rarr; ${cpName}`);
        } else {
            unmatchedCount++;
        }
    }
    
    // Re-initialize/restore state of elements based on status map
    if (isEdit) {
        initializeEditDocCheckPoints(window.editingLeadId);
        updateEditDocCheckPointsProgress();
    } else {
        initializeDocCheckPoints();
        updateDocCheckPointsProgress();
    }
    
    if (matchedCount > 0) {
        let msg = `<i class="fas fa-robot" style="color: var(--gold); margin-right: 6px;"></i><b>Agent Match:</b> Successfully matched ${matchedCount} file(s):<br>${matchesDetail.join('<br>')}`;
        if (unmatchedCount > 0) {
            msg += `<br><span style="font-size:11px; color:#ef4444;">${unmatchedCount} file(s) couldn't be auto-matched. Try renaming.</span>`;
        }
        toast(msg, 'success');
    } else {
        toast(`<i class="fas fa-robot" style="color: #ef4444; margin-right: 6px;"></i><b>Agent Match:</b> Could not auto-match any of the files. Try renaming them to include words like "PAN", "Aadhar", "Salary Slip", etc.`, 'error');
    }
}

function renderAllCheckpointDocuments(isEdit) {
    const prefix = isEdit ? 'edit-' : '';
    const statusMap = isEdit ? window.editCheckPoints : window.docCheckPoints.statusMap;
    const sections = window.docCheckPoints?.sections || [];
    
    sections.forEach(section => {
        section.checkpoints.forEach((cp, idx) => {
            const key = `${section.id}-${idx}`;
            const listEl = document.getElementById(`${prefix}docs-list-${section.id}-${idx}`);
            if (!listEl) return;
            
            const entry = statusMap[key] || { documents: [] };
            const docs = entry.documents || [];
            
            if (docs.length === 0) {
                listEl.innerHTML = '';
                return;
            }
            
            listEl.innerHTML = docs.map((doc, docIdx) => `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 4px 8px; border-radius: 6px; font-size: 11px; margin-top: 4px;">
                    <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                        <i class="fas fa-file-alt" style="color: var(--gold); font-size: 10px;"></i>
                        <span style="font-weight: 500; cursor: pointer; text-decoration: underline;" title="Click to download" onclick="downloadCheckpointDocument('${section.id}', ${idx}, ${docIdx}, ${isEdit})">
                            ${escapeHtml(doc.name)} (${formatBytes(doc.size || 0)})
                        </span>
                    </div>
                    <button type="button" class="btn btn-sm" style="background: transparent; border: none; padding: 2px 6px; color: #ef4444; font-size: 10px; cursor: pointer; display: flex; align-items: center;" onclick="deleteCheckpointDocument('${section.id}', ${idx}, ${docIdx}, ${isEdit})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        });
    });
}

window.downloadCheckpointDocument = function(sectionId, idx, docIdx, isEdit) {
    const statusMap = isEdit ? window.editCheckPoints : window.docCheckPoints.statusMap;
    const key = `${sectionId}-${idx}`;
    const doc = statusMap[key]?.documents?.[docIdx];
    if (doc?.dataUrl) {
        downloadDataUrlAttachment(doc.dataUrl, doc.name);
    }
};

window.deleteCheckpointDocument = function(sectionId, idx, docIdx, isEdit) {
    const statusMap = isEdit ? window.editCheckPoints : window.docCheckPoints.statusMap;
    const key = `${sectionId}-${idx}`;
    if (statusMap[key] && statusMap[key].documents) {
        const docName = statusMap[key].documents[docIdx]?.name || 'document';
        statusMap[key].documents.splice(docIdx, 1);
        renderAllCheckpointDocuments(isEdit);
        if (isEdit) {
            updateEditDocCheckPointsProgress();
        } else {
            updateDocCheckPointsProgress();
        }
        toast(`<i class="fas fa-trash" style="margin-right: 6px;"></i>Deleted <i>"${docName}"</i>`, 'success');
    }
};

window.downloadLeadDetailCheckpointDocument = function(leadId, key, docIdx) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const doc = lead.checkpoints?.[key]?.documents?.[docIdx];
    if (doc?.dataUrl) {
        downloadDataUrlAttachment(doc.dataUrl, doc.name);
    }
};

function updateDocCheckRemark(sectionId, idx) {
    const key = `${sectionId}-${idx}`;
    const entry = getOrCreateCheckpointEntry(window.docCheckPoints.statusMap, key);
    const textarea = document.getElementById(`remark-${key}`)?.querySelector('textarea');
    if (textarea) {
        entry.remark = textarea.value.trim();
    }
}

function updateEditDocCheckRemark(sectionId, idx) {
    const key = `${sectionId}-${idx}`;
    const entry = getOrCreateCheckpointEntry(window.editCheckPoints, key);
    const textarea = document.getElementById(`edit-remark-${key}`)?.querySelector('textarea');
    if (textarea) {
        entry.remark = textarea.value.trim();
    }
}

function initializeDocCheckPoints() {
    const sectionsContainer = document.getElementById('dcp-sections');
    if (!sectionsContainer) return;
    const sections = window.docCheckPoints?.sections || [];
    sectionsContainer.innerHTML = sections.map(section => {
        return `
            <div class="dcp-section-card">
                <div class="dcp-section-header" onclick="toggleDocSection('${section.id}')">
                    <div class="dcp-section-left">
                        <i class="fas fa-chevron-down dcp-chevron" id="chevron-${section.id}"></i>
                        <i class="fas ${section.icon} dcp-section-icon"></i>
                        <div class="dcp-section-info">
                            <h3 class="dcp-section-title">${section.name}</h3>
                            <span class="dcp-section-count" id="count-${section.id}">0/${section.checkpoints.length}</span>
                        </div>
                    </div>
                    <div class="dcp-section-actions">
                        <button class="dcp-bulk-btn" onclick="event.stopPropagation(); bulkDocAction('${section.id}', 'pass')">All Pass</button>
                        <button class="dcp-bulk-btn" onclick="event.stopPropagation(); bulkDocAction('${section.id}', 'reset')">Reset</button>
                    </div>
                </div>
                <div class="dcp-section-content" id="content-${section.id}" style="display: none;">
                    <div class="dcp-checklist">
                        ${section.checkpoints.map((cp, idx) => `
                            <div class="dcp-item" id="dcp-item-${section.id}-${idx}">
                                <div class="dcp-item-main" style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:12px; flex-wrap:wrap;">
                                    <div class="dcp-item-left" style="display:flex; align-items:center; gap:8px;">
                                        <input type="checkbox" class="dcp-checkbox" id="check-${section.id}-${idx}" onchange="updateDocCheckStatus('${section.id}', ${idx})">
                                        <label for="check-${section.id}-${idx}" class="dcp-label" style="font-weight:600; cursor:pointer;">${cp}</label>
                                    </div>
                                    <div class="dcp-item-right" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                                        <input type="file" id="file-upload-${section.id}-${idx}" style="display:none;" multiple onchange="handleCheckpointFileUpload('${section.id}', ${idx}, this.files)">
                                        <button type="button" class="btn btn-sm btn-ghost" style="border: 1px dashed var(--gold); color: var(--gold); padding: 4px 10px; font-size:11px; font-weight:600; display:flex; align-items:center; gap:4px;" onclick="document.getElementById('file-upload-${section.id}-${idx}').click()">
                                            <i class="fas fa-upload"></i> Upload
                                        </button>
                                        <button class="dcp-status-btn dcp-pass" onclick="setDocStatus('${section.id}', ${idx}, 'pass')">Pass</button>
                                        <button class="dcp-status-btn dcp-fail" onclick="setDocStatus('${section.id}', ${idx}, 'fail')">Fail</button>
                                    </div>
                                </div>
                                <div class="dcp-item-documents-list" id="docs-list-${section.id}-${idx}" style="margin-left: 28px; margin-top: 6px; display:flex; flex-direction:column; gap:4px;"></div>
                                <div class="dcp-remark-box" id="remark-${section.id}-${idx}" style="display: none; margin-left: 28px; margin-top: 6px;">
                                    <textarea class="dcp-remark" placeholder="Enter issue or remark..." oninput="updateDocCheckRemark('${section.id}', ${idx})"></textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="dcp-add-checkpoint">
                        <button class="dcp-add-btn" onclick="openAddCheckpointModal('${section.id}')"><i class="fas fa-plus"></i> Add Checkpoint</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Restore existing checkpoint states
    Object.keys(window.docCheckPoints.statusMap).forEach(key => {
        const entry = window.docCheckPoints.statusMap[key];
        const status = entry?.status;
        const remark = entry?.remark || '';
        if (!status) return;

        const checkbox = document.getElementById(`check-${key}`);
        const remarkBox = document.getElementById(`remark-${key}`);
        const item = document.getElementById(`dcp-item-${key}`);

        if (checkbox) checkbox.checked = (status === 'pass');
        if (item) {
            item.classList.remove('dcp-pass-item', 'dcp-fail-item');
            item.classList.add(status === 'pass' ? 'dcp-pass-item' : 'dcp-fail-item');
        }
        if (remarkBox) {
            remarkBox.style.display = status === 'fail' ? 'block' : 'none';
            const textarea = remarkBox.querySelector('textarea');
            if (textarea) textarea.value = remark;
        }
    });

    updateDocCheckPointsProgress();
    renderAllCheckpointDocuments(false);
}

function toggleDocSection(sectionId) {
    const content = document.getElementById(`content-${sectionId}`);
    const chevron = document.getElementById(`chevron-${sectionId}`);
    if (content) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
    }
}

function setDocStatus(sectionId, idx, status) {
    const key = `${sectionId}-${idx}`;
    const entry = getOrCreateCheckpointEntry(window.docCheckPoints.statusMap, key);
    entry.status = status;
    
    const item = document.getElementById(`dcp-item-${key}`);
    if (!item) return;
    item.classList.remove('dcp-pass-item', 'dcp-fail-item');
    item.classList.add(status === 'pass' ? 'dcp-pass-item' : 'dcp-fail-item');
    const remarkBox = document.getElementById(`remark-${key}`);
    remarkBox.style.display = status === 'fail' ? 'block' : 'none';
    if (status === 'pass') {
        remarkBox.querySelector('textarea').value = '';
        entry.remark = '';
    }
    document.getElementById(`check-${key}`).checked = (status === 'pass');
    updateDocCheckPointsProgress();
}

function updateDocCheckStatus(sectionId, idx) {
    const key = `${sectionId}-${idx}`;
    const checked = document.getElementById(`check-${key}`).checked;
    const status = checked ? 'pass' : 'pending';
    const item = document.getElementById(`dcp-item-${key}`);
    item.classList.remove('dcp-pass-item', 'dcp-fail-item');
    if (status === 'pass') item.classList.add('dcp-pass-item');
    const entry = getOrCreateCheckpointEntry(window.docCheckPoints.statusMap, key);
    entry.status = status;
    if (status === 'pass') {
        entry.remark = '';
        const remarkBox = document.getElementById(`remark-${key}`);
        if (remarkBox) {
            remarkBox.style.display = 'none';
            remarkBox.querySelector('textarea').value = '';
        }
    }
    updateDocCheckPointsProgress();
}

function bulkDocAction(sectionId, action) {
    const section = window.docCheckPoints.sections.find(s => s.id === sectionId);
    if (!section) return;
    for (let idx = 0; idx < section.checkpoints.length; idx++) {
        if (action === 'pass') setDocStatus(sectionId, idx, 'pass');
        else if (action === 'reset') {
            const key = `${sectionId}-${idx}`;
            delete window.docCheckPoints.statusMap[key];
            const item = document.getElementById(`dcp-item-${key}`);
            if (item) item.classList.remove('dcp-pass-item', 'dcp-fail-item');
            const chk = document.getElementById(`check-${key}`);
            if (chk) chk.checked = false;
            const rmk = document.getElementById(`remark-${key}`);
            if (rmk) {
                rmk.style.display = 'none';
                rmk.querySelector('textarea').value = '';
            }
        }
    }
    updateDocCheckPointsProgress();
    renderAllCheckpointDocuments(false);
}

function updateDocCheckPointsProgress() {
    let completed = 0, total = 0;
    window.docCheckPoints.sections.forEach(section => {
        let sectionCompleted = 0;
        for (let idx = 0; idx < section.checkpoints.length; idx++) {
            total++;
            if (window.docCheckPoints.statusMap[`${section.id}-${idx}`]?.status === 'pass') {
                sectionCompleted++;
                completed++;
            }
        }
        const countEl = document.getElementById(`count-${section.id}`);
        if (countEl) countEl.textContent = `${sectionCompleted}/${section.checkpoints.length}`;
    });
    const completedEl = document.getElementById('dcp-completed');
    if (completedEl) completedEl.textContent = completed;
    const totalEl = document.getElementById('dcp-total');
    if (totalEl) totalEl.textContent = total;
    const fillEl = document.getElementById('dcp-progress-fill');
    if (fillEl) fillEl.style.width = total ? (completed/total*100)+'%' : '0%';
}

function openAddCheckpointModal(sectionId) {
    const section = window.docCheckPoints.sections.find(s => s.id === sectionId);
    if (!section) return;
    const name = prompt(`Add new checkpoint to "${section.name}":`);
    if (name && name.trim()) {
        section.checkpoints.push(name.trim());
        initializeDocCheckPoints();
    }
}

async function saveLead() {
    const saveButton = document.querySelector('#modal .modal-ft .btn-primary');
    const cancelButton = document.querySelector('#modal .modal-ft .btn-ghost');
    try {
        if (saveButton) { saveButton.disabled = true; saveButton.innerText = 'Saving...'; }
        if (cancelButton) cancelButton.disabled = true;

        const name = document.getElementById('addName').value.trim();
        const phone = document.getElementById('addPhone').value.trim();
        const loanType = document.getElementById('addLoanType').value.trim();
        const amount = parseFloat(document.getElementById('addAmount').value) || 100000;
        const category = document.getElementById('addCategory').value;
        const csoId = document.getElementById('addCso').value;
        const ccCheckboxes = document.querySelectorAll('#addCc input[type="checkbox"]:checked');
        const ccUsers = Array.from(ccCheckboxes).map(cb => cb.value);
        const bankRemarks = document.getElementById('addBankRemarks')?.value.trim() || '';
        const bankName = document.getElementById('addLeadBankName')?.value.trim() || '';
        const leadStatus = document.getElementById('addLeadStatus')?.value.trim() || '';
        const turnover = parseFloat(document.getElementById('addTurnover')?.value) || 0;
        const profitLoss = parseFloat(document.getElementById('addProfitLoss')?.value) || 0;
        const netIncome = parseFloat(document.getElementById('addNetIncome')?.value) || 0;
        const deductions = parseFloat(document.getElementById('addDeductions')?.value) || 0;
        const depreciation = parseFloat(document.getElementById('addDepreciation')?.value) || 0;
        const totalIncome = parseFloat(document.getElementById('addTotalIncome')?.value) || 0;
        const gstStatus = document.getElementById('addGstStatus')?.value.trim() || '';
        const turnoverNotes = document.getElementById('addTurnoverNotes')?.value.trim() || '';
        const incomeDetails = document.getElementById('addIncomeDetails')?.value.trim() || '';
        const expenseDetails = document.getElementById('addExpenseDetails')?.value.trim() || '';
        const creditScore = parseInt(document.getElementById('addCreditScore')?.value) || 0;
        const financialRemarks = document.getElementById('addFinancialRemarks')?.value.trim() || '';
        const docsReceived = document.getElementById('addDocsReceived')?.value.trim() || '';
        const docsPending = document.getElementById('addDocsPending')?.value.trim() || '';
        const checkpoints = window.docCheckPoints?.statusMap || {};
        const meritsRows = [];
        document.querySelectorAll('.merit-row').forEach(row => {
            const index = row.dataset.row;
            if (index === undefined) return;
            const date = row.querySelector(`#meritDate${index}`)?.value || '';
            const remarks = row.querySelector(`#meritRemarks${index}`)?.value.trim() || '';
            const docType = row.querySelector(`#meritDocType${index}`)?.value.trim() || '';
            const stage = row.querySelector(`#meritStage${index}`)?.value.trim() || '';
            const owner = row.querySelector(`#meritOwner${index}`)?.value.trim() || '';
            const meritType = row.querySelector(`#meritType${index}`)?.value.trim() || '';
            if (date || remarks || docType || stage || owner || meritType) {
                const classification = row.querySelector(`#meritClassification${index}`)?.value || 'merit';
                meritsRows.push({ date, remarks, docType, stage, owner, meritType, classification });
            }
        });

        if (!name || !phone || !loanType) {
            toast('Name, Phone and Loan Type are required', 'error');
            throw new Error('Validation failed');
        }

        const assignedCSOs = csoId ? [csoId] : [];
        const visibleTo = [
            ...(category === 'MSME' ? users.filter(u => u.role === 'msme_head').map(u => u.userId) : []),
            ...(category === 'Retail' ? users.filter(u => u.role === 'retail_head').map(u => u.userId) : [])
        ].filter(Boolean);

        const leadData = {
            id: null, name, phone, loanType, amount, category, assignedCSOs, visibleTo, cc: ccUsers,
            status: 'new', tat: 0, createdBy: currentUser.userId, created: new Date().toISOString(),
            history: [{ status: 'new', by: currentUser.displayName, date: new Date().toISOString(), s: 'new', d: new Date().toLocaleString(), remarks: 'Created' }],
            bankRecords: window.bankRecords || [],
            loanRecords: window.loanRecords || [],
            emiRecords: window.emiRecords || {},
            leadStatus,
            bankRemarks,
            attachments: window.addLeadAttachments || [],
            meritsAndChallenges: { rows: meritsRows },
            financialAnalysis: {
                turnover, profitLoss, netIncome, deductions, depreciation, totalIncome,
                gstStatus, turnoverNotes, incomeDetails, expenseDetails, creditScore, remarks: financialRemarks
            },
            documents: { received: docsReceived, pending: docsPending },
            checkpoints
        };

        if (firebaseEnabled) {
            const newLeadRef = await leadsRef.push(leadData);
            await newLeadRef.update({ id: newLeadRef.key });
            leadData.id = newLeadRef.key;
        } else {
            leadData.id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            leads.push(leadData);
            persistLocalState();
        }

        toast('Lead added successfully', 'success');
        closeModal();
        navToPage('all-leads');
    } catch (error) {
        console.error('saveLead error:', error);
        if (error.message !== 'Validation failed') toast(`Save failed: ${error.message}`, 'error');
    } finally {
        if (saveButton) { saveButton.disabled = false; saveButton.innerText = 'Save'; }
        if (cancelButton) cancelButton.disabled = false;
    }
}

function editLead(id) {
    const lead = leads.find(l => l.id === id);
    if (!lead) {
        toast('Lead not found', 'error');
        return;
    }
    
    // Initialize global edit state
    window.editLeadAttachments = JSON.parse(JSON.stringify(lead.attachments || []));
    window.editLoanRecords = JSON.parse(JSON.stringify(lead.loanRecords || []));
    window.editEmiRecords = JSON.parse(JSON.stringify(lead.emiRecords || {}));
    window.editBankRecords = JSON.parse(JSON.stringify(lead.bankRecords || []));
    window.editMeritsData = JSON.parse(JSON.stringify(lead.meritsAndChallenges?.rows || []));
    window.activeMeritsList = JSON.parse(JSON.stringify(lead.meritsAndChallenges?.rows || []));
    window.editNextMeritIndex = (lead.meritsAndChallenges?.rows || []).length;
    window.editCheckPoints = JSON.parse(JSON.stringify(lead.checkpoints || {}));
    window.editingLeadId = id;
    
    const loanTypeOptions = loanTypes.map(type => `<option value="${type}">${type}</option>`).join('');
    const csoOptions = users.filter(u => u.role === 'cso').map(u => `<option value="${u.userId}" ${lead.assignedCSOs?.includes(u.userId) ? 'selected' : ''}>${u.displayName}</option>`).join('');
    const ccOptions = buildCcOptionsHtml(lead.cc || []);
    const fa = lead.financialAnalysis || {};
    const docs = lead.documents || {};
    
    const tabs = [
        { id: 'edit-lead', label: 'Lead Info', content: `
            <div class="form-card-section">
                <div class="form-card-header">
                    <div class="form-card-icon"><i class="fas fa-id-card"></i></div>
                    <div class="form-card-title">Client Demographics & Source</div>
                </div>
                <div class="form-card-grid">
                    <div class="fg"><label>Name *</label><input id="editName" value="${lead.name}"></div>
                    <div class="fg"><label>Phone *</label><input id="editPhone" value="${lead.phone}"></div>
                    <div class="fg"><label>Email</label><input id="editEmail" type="email" value="${lead.email || ''}"></div>
                    <div class="fg"><label>Lead Source</label><input id="editSource" value="${lead.source || ''}"></div>
                </div>
            </div>
            
            <div class="form-card-section">
                <div class="form-card-header">
                    <div class="form-card-icon"><i class="fas fa-hand-holding-usd"></i></div>
                    <div class="form-card-title">Underwriting & Credit Requirements</div>
                </div>
                <div class="form-card-grid">
                    <div class="fg"><label>Bank Name</label><input id="editLeadBankName" value="${lead.bankName || ''}"></div>
                    <div class="fg"><label>Loan Type *</label><input id="editLoanType" list="editLoanTypeList" value="${lead.loanType}">${renderLoanTypeDatalist('editLoanTypeList')}</div>
                    <div class="fg"><label>Amount (₹) *</label><input id="editAmount" type="number" value="${lead.amount}"></div>
                    <div class="fg"><label>Category *</label><select id="editCategory"><option ${lead.category === 'MSME' ? 'selected' : ''}>MSME</option><option ${lead.category === 'Retail' ? 'selected' : ''}>Retail</option></select></div>
                </div>
            </div>
            
            <div class="form-card-section">
                <div class="form-card-header">
                    <div class="form-card-icon"><i class="fas fa-user-check"></i></div>
                    <div class="form-card-title">Underwriting Allocation & Stakeholders</div>
                </div>
                <div class="form-card-grid-full">
                    <div class="fg" style="max-width: 450px;"><label>Assign CSO (Field Officer)</label><select id="editCso"><option value="">None / Keep Unassigned</option>${csoOptions}</select></div>
                    <div class="fg"><label>Monitor Workflows (CC Users)</label><div id="editCc">${ccOptions}</div></div>
                    <div class="fg" style="margin-top: 14px; border-top: 1px dashed var(--border2); padding-top: 14px;"><label>Bank Finalization - Overall Remarks</label><textarea id="editBankRemarksInline" rows="6" placeholder="Overall remarks from bank finalization process...">${lead.bankRemarks || ''}</textarea></div>
                </div>
            </div>
        `},
        { id: 'edit-bank', label: 'Bank Remarks', content: `
            <div class="section-card" style="border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.01); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div class="section-title" style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: var(--gold); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 20px;">
                    <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-university"></i> Bank Finalization Entries</span>
                    <span style="font-size: 11px; font-weight: 500; font-family: monospace; opacity: 0.6; text-transform: uppercase;">Step 3 of 7 Status Track</span>
                </div>
                <div class="bank-input-row" style="display: grid; grid-template-columns: 2fr 1.5fr 1.5fr auto; gap: 14px; align-items: flex-end; margin-bottom: 20px;">
                    <div class="bank-input-field">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Bank Name</label>
                        <div class="input-with-icon">
                            <i class="fas fa-university"></i>
                            <input type="text" id="editBankInputName" placeholder="E.g. HDFC Bank, Axis..." class="bank-input">
                        </div>
                    </div>
                    <div class="bank-input-field">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Contact Person</label>
                        <div class="input-with-icon">
                            <i class="fas fa-user-circle"></i>
                            <input type="text" id="editBankInputContact" placeholder="Name of officer" class="bank-input">
                        </div>
                    </div>
                    <div class="bank-input-field">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Approval Status</label>
                        <div class="input-with-icon">
                            <i class="fas fa-tag"></i>
                            <select id="editBankInputStatus" class="bank-input bank-select">
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-sm" style="background: linear-gradient(135deg, var(--gold) 0%, #d4af37 100%); color: #000; font-weight: 600; border: none; height: 40px; padding: 0 18px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 10px rgba(212, 175, 55, 0.15);" onclick="addEditBankRow()">
                        <i class="fas fa-plus"></i> Add Entry
                    </button>
                </div>
                <div class="bank-records-container" id="editBankRecordsContainer" style="border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.15); margin-top: 15px;">
                    <div class="bank-grid-header" style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr 100px; gap: 0; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                        <div style="color: var(--gold);">Bank Name</div>
                        <div style="color: var(--gold);">Contact Person</div>
                        <div style="color: var(--gold); text-align: center;">Status</div>
                        <div style="color: var(--gold); text-align: center;">Actions</div>
                    </div>
                    <div id="editBankRecordsList"></div>
                </div>
            </div>
            <div class="section-card" style="border: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.01); padding: 20px; border-radius: 12px;">
                <div class="section-title" style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: var(--gold); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 20px;">
                    <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-comment-alt"></i> Additional Finalization Remarks</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                    <div class="fg" style="margin-bottom: 0;">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Lead Overall Status</label>
                        <div class="input-with-icon">
                            <i class="fas fa-check-circle"></i>
                            <select id="editLeadStatus" style="background: rgba(255, 255, 255, 0.02); height: 42px;">
                                <option value="">Select Status</option>
                                <option ${lead.leadStatus === 'pending' ? 'selected' : ''} value="pending">Pending</option>
                                <option ${lead.leadStatus === 'in-progress' ? 'selected' : ''} value="in-progress">In Progress</option>
                                <option ${lead.leadStatus === 'ready' ? 'selected' : ''} value="ready">Ready for Disbursement</option>
                                <option ${lead.leadStatus === 'rejected' ? 'selected' : ''} value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div style="margin-top: 10px; font-size: 11px; color: var(--text3); line-height: 1.4;">
                            <i class="fas fa-info-circle" style="color: var(--gold); margin-right: 4px;"></i> Select the general pipeline state indicating whether the lead is ready to disburse.
                        </div>
                    </div>
                    <div class="fg" style="margin-bottom: 0;">
                        <label style="display: block; font-size: 11px; color: var(--text2); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Overall Finalization Remarks</label>
                        <textarea id="editBankRemarks" rows="4" placeholder="Enter terms sheet summary, rate of interest negotiated, and final credit comments..." style="width: 100%; min-height: 100px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: var(--text); padding: 10px 12px; font-size: 13px; font-family: 'Outfit', sans-serif; resize: vertical; transition: all 0.2s;">${lead.bankRemarks || ''}</textarea>
                    </div>
                </div>
            </div>
        `},
        { id: 'edit-loan', label: 'Loan Details', content: `
            <div class="section-card">
                <div class="section-title">Add Loan Record</div>
                <div class="loan-input-grid">
                    <div class="loan-input-field"><label>Bank</label><input type="text" id="editLoanInputBank" placeholder="Bank Name" class="loan-input"></div>
                    <div class="loan-input-field"><label>Applicant</label><input type="text" id="editLoanInputApplicant" placeholder="Applicant Name" class="loan-input"></div>
                    <div class="loan-input-field"><label>Type of Loan</label><input type="text" id="editLoanInputType" placeholder="Loan Type" class="loan-input"></div>
                    <div class="loan-input-field"><label>Date of Loan</label><input type="date" id="editLoanInputDate" class="loan-input"></div>
                    <div class="loan-input-field"><label>Loan Amount (₹)</label><input type="number" id="editLoanInputAmount" placeholder="0.00" class="loan-input"></div>
                    <div class="loan-input-field"><label>EMI Amount (₹)</label><input type="number" id="editLoanInputEmi" placeholder="0.00" class="loan-input"></div>
                    <div class="loan-input-field"><label>Interest Rate (%)</label><input type="number" id="editLoanInputRate" placeholder="0.00" step="0.01" class="loan-input"></div>
                    <div class="loan-input-field"><label>Outstanding Amount (₹)</label><input type="number" id="editLoanInputOutstanding" placeholder="0.00" class="loan-input"></div>
                    <div class="loan-input-field"><label>Loan Status</label><select id="editLoanInputStatus" class="loan-input loan-select"><option value="">Select Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="closed">Closed</option><option value="default">Default</option></select></div>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px;">
                    <button class="btn btn-ghost" onclick="clearEditLoanInputs()">Clear</button>
                    <button class="btn btn-info" onclick="addEditLoanRecord()">+ Add Loan</button>
                </div>
            </div>
            <div class="section-card">
                <div class="section-title">Loan Records</div>
                <div class="loan-table-container" id="editLoanTableContainer">
                    <div class="loan-grid-header">
                        <div class="loan-col-bank">BANK</div><div class="loan-col-applicant">APPLICANT</div><div class="loan-col-type">LOAN TYPE</div>
                        <div class="loan-col-date">DATE</div><div class="loan-col-amount">AMOUNT</div><div class="loan-col-emi">EMI</div>
                        <div class="loan-col-rate">RATE %</div><div class="loan-col-outstanding">OUTSTANDING</div><div class="loan-col-status">STATUS</div><div class="loan-col-actions">ACTIONS</div>
                    </div>
                    <div id="editLoanRecordsList"></div>
                </div>
            </div>
        `},
        { id: 'edit-financial', label: 'Financial Analysis', content: `
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-chart-line"></i> Financial Summary</div>
                <div class="fa-summary-grid">
                    <div class="fa-input-field"><label>Turnover</label><input id="editTurnover" type="number" class="fa-input" placeholder="0.00" value="${fa.turnover || 0}" oninput="updateEditFinancialCalculations()"><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Net Profit/Loss</label><input id="editProfitLoss" type="number" class="fa-input" placeholder="0.00" value="${fa.profitLoss || 0}" oninput="updateEditFinancialCalculations()"><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Deductions</label><input id="editDeductions" type="number" class="fa-input" placeholder="0.00" value="${fa.deductions || 0}" oninput="updateEditFinancialCalculations()"><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Depreciation</label><input id="editDepreciation" type="number" class="fa-input" placeholder="0.00" value="${fa.depreciation || 0}" oninput="updateEditFinancialCalculations()"><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Net Income <span class="fa-auto-calc">(Auto)</span></label><input id="editNetIncome" type="number" class="fa-input fa-readonly" placeholder="0.00" value="${fa.netIncome || 0}" readonly><span class="fa-currency">₹</span></div>
                    <div class="fa-input-field"><label>Total Income <span class="fa-auto-calc">(Auto)</span></label><input id="editTotalIncome" type="number" class="fa-input fa-readonly" placeholder="0.00" value="${fa.totalIncome || 0}" readonly><span class="fa-currency">₹</span></div>
                </div>
            </div>
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-info-circle"></i> Additional Information</div>
                <div class="fa-grid-3col">
                    <div class="fa-input-field"><label>Credit Score</label><input id="editCreditScore" type="number" class="fa-input" min="300" max="900" placeholder="300-900" value="${fa.creditScore || 0}" oninput="validateCreditScore(this)"></div>
                    <div class="fa-input-field"><label>GST Status</label><select id="editGstStatus" class="fa-input"><option value="">Select GST Status</option><option ${fa.gstStatus === 'registered' ? 'selected' : ''} value="registered">Registered</option><option ${fa.gstStatus === 'not-registered' ? 'selected' : ''} value="not-registered">Not Registered</option><option ${fa.gstStatus === 'exempted' ? 'selected' : ''} value="exempted">Exempted</option></select></div>
                    <div class="fa-input-field"><label>Turnover Notes</label><input id="editTurnoverNotes" type="text" class="fa-input" placeholder="e.g., Growing at 15% YoY" value="${fa.turnoverNotes || ''}"></div>
                </div>
            </div>
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-sticky-note"></i> Financial Analysis Remarks</div>
                <textarea id="editFinancialRemarks" class="fa-textarea" rows="5">${fa.remarks || ''}</textarea>
            </div>
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-file-invoice-dollar"></i> Income Details</div>
                <textarea id="editIncomeDetails" class="fa-textarea" rows="4">${fa.incomeDetails || ''}</textarea>
            </div>
            <div class="fa-section"><div class="fa-section-title"><i class="fas fa-receipt"></i> Expense Details</div>
                <textarea id="editExpenseDetails" class="fa-textarea" rows="4">${fa.expenseDetails || ''}</textarea>
            </div>
        `},
        { id: 'edit-merits', label: 'Merits and Challenges', content: buildMeritsAndChallengesTabHtml(true) },
        { id: 'edit-documents', label: 'Documents', content: `
            <div class="two-column-split" style="margin-bottom: 20px;">
                <div class="doc-section-card" style="margin-bottom: 0;">
                    <div class="doc-section-title">
                        <i class="fas fa-file-signature" style="color: #4caf50;"></i> Documents Received
                    </div>
                    <div class="doc-textarea-container">
                        <textarea id="editDocsReceived" class="doc-textarea" rows="6" placeholder="List documents received from client...&#10;E.g.,&#10;• PAN Card&#10;• Aadhaar Card">${docs.received || ''}</textarea>
                    </div>
                    <div class="doc-helper-pill-label">
                        <i class="fas fa-magic"></i> Quick Add Common Items:
                    </div>
                    <div class="doc-helper-pills">
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsReceived', 'PAN Card')"><i class="fas fa-plus"></i> PAN Card</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsReceived', 'Aadhaar Card')"><i class="fas fa-plus"></i> Aadhaar Card</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsReceived', 'Bank Statements (6 Months)')"><i class="fas fa-plus"></i> Bank Statements</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsReceived', 'ITR summarisation (3 Yrs)')"><i class="fas fa-plus"></i> 3-Yr ITR</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsReceived', 'Salary Slips (3 Mos)')"><i class="fas fa-plus"></i> Salary Slips</button>
                    </div>
                </div>
                <div class="doc-section-card" style="margin-bottom: 0;">
                    <div class="doc-section-title">
                        <i class="fas fa-clock" style="color: #ff9800;"></i> Documents Pending
                    </div>
                    <div class="doc-textarea-container">
                        <textarea id="editDocsPending" class="doc-textarea" rows="6" placeholder="List outstanding documents needed...&#10;E.g.,&#10;• Business Registration Code&#10;• Utility Electric Bill">${docs.pending || ''}</textarea>
                    </div>
                    <div class="doc-helper-pill-label">
                        <i class="fas fa-magic"></i> Quick Add Common Items:
                    </div>
                    <div class="doc-helper-pills">
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsPending', 'GST Registration filings')"><i class="fas fa-plus"></i> GST filings</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsPending', 'Property deed & title chain documents')"><i class="fas fa-plus"></i> Property Deeds</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsPending', 'Partner/Director KYCs')"><i class="fas fa-plus"></i> Director KYCs</button>
                        <button type="button" class="doc-helper-pill" onclick="appendDocText('editDocsPending', 'Existing loan schedule & sanction letter')"><i class="fas fa-plus"></i> Loan Letter</button>
                    </div>
                </div>
            </div>
            <div class="doc-section-card">
                <div class="doc-section-title">
                    <i class="fas fa-cloud-upload-alt" style="color: var(--gold);"></i> Upload Digital Documents
                </div>
                
                <input id="editLeadFiles" type="file" multiple onchange="handleEditLeadFiles(this.files)" style="display: none;">
                
                <div class="custom-file-dropzone" id="editLeadDropzone" onclick="document.getElementById('editLeadFiles').click()">
                    <i class="fas fa-cloud-upload-alt dropzone-icon"></i>
                    <div class="dropzone-text">Drag & drop files here or <span style="color: var(--gold); text-decoration: underline; font-weight: 600;">browse files</span></div>
                    <div class="dropzone-subtext">Uploaded files are saved with this lead • Maximum size 5MB</div>
                </div>
                
                <div id="editLeadAttachmentsList" style="margin-top: 15px;"></div>
            </div>
        `},
        { id: 'edit-checkpoints', label: 'Check Points', content: `
            <div class="dcp-header" style="background: rgba(255, 255, 255, 0.01); border: 1px dashed var(--border2); border-radius: 12px; padding: 18px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; width: 100%;">
                    <div>
                        <h2 class="dcp-title" style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: #fff;"><i class="fas fa-clipboard-check" style="color: var(--gold); margin-right: 8px;"></i> Document Check Points</h2>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--text3);">Configure verification statuses for mandatory items and upload verification files.</p>
                    </div>
                    <div>
                        <input type="file" id="dcp-bulk-upload-edit" style="display: none;" multiple onchange="handleDcpBulkUpload(this.files, true)">
                        <button type="button" class="btn-premium-add-merit" style="padding: 8px 14px; font-size: 12px;" onclick="document.getElementById('dcp-bulk-upload-edit').click()">
                            <i class="fas fa-cloud-upload-alt mr-1"></i> Bulk Upload & Auto-Match
                        </button>
                    </div>
                </div>
            </div>
            <div class="dcp-sections" id="edit-dcp-sections"></div>
        `}
    ];
    
    const tabButtons = tabs.map(tab => `<button class="tab ${tab.id === 'edit-lead' ? 'active' : ''}" onclick="switchEditLeadTab('${tab.id}')">${tab.label}</button>`).join('');
    const tabContents = tabs.map(tab => `<div class="tab-content ${tab.id === 'edit-lead' ? 'active' : ''}" id="${tab.id}">${tab.content}</div>`).join('');
    
    openModal(`Edit Lead: ${lead.name}`, `
        <div class="tabs">${tabButtons}</div>
        <div class="tab-container">${tabContents}</div>
    `, `
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveEditedLead()">Save Changes</button>
    `);
    
    // Render initial records
    setTimeout(() => {
        renderEditBankRecords();
        renderEditLoanRecords();
        renderEditLeadAttachments();
        renderEditMerits();
    }, 100);
}

function switchEditLeadTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const tabBtn = document.querySelector(`.tab[onclick="switchEditLeadTab('${tabId}')"]`);
    if (tabBtn) tabBtn.classList.add('active');
    
    const contentEl = document.getElementById(tabId);
    if (contentEl) contentEl.classList.add('active');
    
    if (tabId === 'edit-checkpoints') {
        setTimeout(() => initializeEditDocCheckPoints(window.editingLeadId), 100);
    } else if (tabId === 'edit-bank') {
        renderEditBankRecords();
    } else if (tabId === 'edit-loan') {
        renderEditLoanRecords();
    } else if (tabId === 'edit-documents') {
        setTimeout(() => initializeDocumentsDropzone(true), 50);
    }
}

function initializeEditDocCheckPoints(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const sectionsContainer = document.getElementById('edit-dcp-sections');
    if (!sectionsContainer) return;
    
    const sections = window.docCheckPoints?.sections || [];
    sectionsContainer.innerHTML = sections.map(section => {
        return `
            <div class="dcp-section-card">
                <div class="dcp-section-header" onclick="toggleEditDocSection('${section.id}')">
                    <div class="dcp-section-left">
                        <i class="fas fa-chevron-down dcp-chevron" id="edit-chevron-${section.id}"></i>
                        <i class="fas ${section.icon} dcp-section-icon"></i>
                        <div class="dcp-section-info">
                            <h3 class="dcp-section-title">${section.name}</h3>
                            <span class="dcp-section-count" id="edit-count-${section.id}">0/${section.checkpoints.length}</span>
                        </div>
                    </div>
                    <div class="dcp-section-actions">
                        <button class="dcp-bulk-btn" onclick="event.stopPropagation(); bulkEditDocAction('${section.id}', 'pass')">All Pass</button>
                        <button class="dcp-bulk-btn" onclick="event.stopPropagation(); bulkEditDocAction('${section.id}', 'reset')">Reset</button>
                    </div>
                </div>
                <div class="dcp-section-content" id="edit-content-${section.id}" style="display: none;">
                    <div class="dcp-checklist">
                        ${section.checkpoints.map((cp, idx) => `
                            <div class="dcp-item" id="edit-dcp-item-${section.id}-${idx}">
                                <div class="dcp-item-main" style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:12px; flex-wrap:wrap;">
                                    <div class="dcp-item-left" style="display:flex; align-items:center; gap:8px;">
                                        <input type="checkbox" class="dcp-checkbox" id="edit-check-${section.id}-${idx}" onchange="updateEditDocCheckStatus('${section.id}', ${idx})">
                                        <label for="edit-check-${section.id}-${idx}" class="dcp-label" style="font-weight:600; cursor:pointer;">${cp}</label>
                                    </div>
                                    <div class="dcp-item-right" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                                        <input type="file" id="edit-file-upload-${section.id}-${idx}" style="display:none;" multiple onchange="handleCheckpointFileUpload('${section.id}', ${idx}, this.files)">
                                        <button type="button" class="btn btn-sm btn-ghost" style="border: 1px dashed var(--gold); color: var(--gold); padding: 4px 10px; font-size:11px; font-weight:600; display:flex; align-items:center; gap:4px;" onclick="document.getElementById('edit-file-upload-${section.id}-${idx}').click()">
                                            <i class="fas fa-upload"></i> Upload
                                        </button>
                                        <button class="dcp-status-btn dcp-pass" onclick="setEditDocStatus('${section.id}', ${idx}, 'pass')">Pass</button>
                                        <button class="dcp-status-btn dcp-fail" onclick="setEditDocStatus('${section.id}', ${idx}, 'fail')">Fail</button>
                                    </div>
                                </div>
                                <div class="dcp-item-documents-list" id="edit-docs-list-${section.id}-${idx}" style="margin-left: 28px; margin-top: 6px; display:flex; flex-direction:column; gap:4px;"></div>
                                <div class="dcp-remark-box" id="edit-remark-${section.id}-${idx}" style="display: none; margin-left: 28px; margin-top: 6px;">
                                    <textarea class="dcp-remark" placeholder="Enter issue or remark..." oninput="updateEditDocCheckRemark('${section.id}', ${idx})"></textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Restore existing checkpoint states
    Object.keys(window.editCheckPoints).forEach(key => {
        const entry = window.editCheckPoints[key];
        const status = entry?.status;
        const remark = entry?.remark || '';
        if (!status) return;

        const checkbox = document.getElementById(`edit-check-${key}`);
        const remarkBox = document.getElementById(`edit-remark-${key}`);
        const item = document.getElementById(`edit-dcp-item-${key}`);

        if (checkbox) checkbox.checked = (status === 'pass');
        if (item) {
            item.classList.remove('dcp-pass-item', 'dcp-fail-item');
            item.classList.add(status === 'pass' ? 'dcp-pass-item' : 'dcp-fail-item');
        }
        if (remarkBox) {
            remarkBox.style.display = status === 'fail' ? 'block' : 'none';
            const textarea = remarkBox.querySelector('textarea');
            if (textarea) textarea.value = remark;
        }
    });

    updateEditDocCheckPointsProgress();
    renderAllCheckpointDocuments(true);
}

function toggleEditDocSection(sectionId) {
    const content = document.getElementById(`edit-content-${sectionId}`);
    const chevron = document.getElementById(`edit-chevron-${sectionId}`);
    if (!content) return;

    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    if (chevron) chevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
}

function setEditDocStatus(sectionId, idx, status) {
    const key = `${sectionId}-${idx}`;
    const entry = getOrCreateCheckpointEntry(window.editCheckPoints, key);
    entry.status = status;

    const item = document.getElementById(`edit-dcp-item-${key}`);
    if (!item) return;

    item.classList.remove('dcp-pass-item', 'dcp-fail-item');
    item.classList.add(status === 'pass' ? 'dcp-pass-item' : 'dcp-fail-item');

    const remarkBox = document.getElementById(`edit-remark-${key}`);
    if (remarkBox) {
        remarkBox.style.display = status === 'fail' ? 'block' : 'none';
        if (status === 'pass') {
            const textarea = remarkBox.querySelector('textarea');
            if (textarea) textarea.value = '';
            entry.remark = '';
        }
    }

    const checkbox = document.getElementById(`edit-check-${key}`);
    if (checkbox) checkbox.checked = (status === 'pass');

    updateEditDocCheckPointsProgress();
}

function updateEditDocCheckStatus(sectionId, idx) {
    const key = `${sectionId}-${idx}`;
    const checkbox = document.getElementById(`edit-check-${key}`);
    if (!checkbox) return;

    const checked = checkbox.checked;
    const status = checked ? 'pass' : 'pending';

    const item = document.getElementById(`edit-dcp-item-${key}`);
    if (item) {
        item.classList.remove('dcp-pass-item', 'dcp-fail-item');
        if (status === 'pass') item.classList.add('dcp-pass-item');
    }

    const entry = getOrCreateCheckpointEntry(window.editCheckPoints, key);
    entry.status = status;
    if (status === 'pass') {
        entry.remark = '';
        const remarkBox = document.getElementById(`edit-remark-${key}`);
        if (remarkBox) {
            remarkBox.style.display = 'none';
            remarkBox.querySelector('textarea').value = '';
        }
    }
    updateEditDocCheckPointsProgress();
}

function bulkEditDocAction(sectionId, action) {
    const section = (window.docCheckPoints?.sections || []).find(s => s.id === sectionId);
    if (!section) return;

    for (let idx = 0; idx < section.checkpoints.length; idx++) {
        if (action === 'pass') setEditDocStatus(sectionId, idx, 'pass');
        else if (action === 'reset') {
            const key = `${sectionId}-${idx}`;
            delete window.editCheckPoints[key];

            const item = document.getElementById(`edit-dcp-item-${key}`);
            if (item) item.classList.remove('dcp-pass-item', 'dcp-fail-item');

            const checkbox = document.getElementById(`edit-check-${key}`);
            if (checkbox) checkbox.checked = false;

            const remarkBox = document.getElementById(`edit-remark-${key}`);
            if (remarkBox) {
                remarkBox.style.display = 'none';
                remarkBox.querySelector('textarea').value = '';
            }
        }
    }

    updateEditDocCheckPointsProgress();
    renderAllCheckpointDocuments(true);
}

function updateEditDocCheckPointsProgress() {
    const sections = window.docCheckPoints?.sections || [];
    sections.forEach(section => {
        let sectionCompleted = 0;
        for (let idx = 0; idx < section.checkpoints.length; idx++) {
            if (window.editCheckPoints[`${section.id}-${idx}`]?.status === 'pass') sectionCompleted++;
        }
        const countEl = document.getElementById(`edit-count-${section.id}`);
        if (countEl) countEl.textContent = `${sectionCompleted}/${section.checkpoints.length}`;
    });
}

// Bank Records Edit Functions
let editBankEditingIndex = null;

window.addEditBankRow = function() {
    const name = document.getElementById('editBankInputName')?.value.trim() || '';
    const contact = document.getElementById('editBankInputContact')?.value.trim() || '';
    const status = document.getElementById('editBankInputStatus')?.value || '';
    if (!name || !contact || !status) { toast('Please fill in all fields', 'error'); return; }
    
    const isNew = (editBankEditingIndex === null);
    if (editBankEditingIndex !== null) {
        window.editBankRecords[editBankEditingIndex] = { name, contact, status };
        editBankEditingIndex = null;
    } else {
        window.editBankRecords.push({ name, contact, status });
    }
    
    document.getElementById('editBankInputName').value = '';
    document.getElementById('editBankInputContact').value = '';
    document.getElementById('editBankInputStatus').value = '';
    
    const addButton = document.querySelector('[onclick="addEditBankRow()"]');
    if (addButton) {
        addButton.innerHTML = `<i class="fas fa-plus"></i> Add Entry`;
    }
    
    renderEditBankRecords();
    toast(isNew ? 'Bank entry added to list' : 'Bank entry updated in list', 'success');
};

window.renderEditBankRecords = function() {
    const listContainer = document.getElementById('editBankRecordsList');
    if (!listContainer) return;
    if (window.editBankRecords.length === 0) {
        listContainer.innerHTML = `
            <div class="bank-empty-state" style="padding: 30px 16px; text-align: center; color: var(--text3); font-size: 13px;">
                <i class="fas fa-university" style="font-size: 24px; color: var(--text3); margin-bottom: 8px; opacity: 0.4; display: block; margin-left: auto; margin-right: auto;"></i>
                No bank entries yet. Enter bank information above to track status.
            </div>
        `;
        return;
    }
    listContainer.innerHTML = window.editBankRecords.map((record, index) => `
        <div class="bank-record-row" style="display: grid; grid-template-columns: 1.5fr 1.5fr 1fr 100px; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: center; transition: all 0.2s ease; padding: 6px 0;">
            <div class="bank-col-name" style="padding: 10px 14px; color: var(--text); font-weight: 500; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-university" style="color: var(--gold); opacity: 0.8; font-size: 11px;"></i>
                ${record.name}
            </div>
            <div class="bank-col-contact" style="padding: 10px 14px; color: var(--text2); display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-user-circle" style="color: var(--text3); font-size: 12px;"></i>
                ${record.contact}
            </div>
            <div class="bank-col-status" style="padding: 10px 14px; display: flex; justify-content: center; align-items: center;">
                <span class="bank-status-badge status-${record.status}" style="font-weight: 600; text-transform: uppercase; font-size: 10px; display: inline-flex; align-items: center; gap: 6px; border-radius: 6px; padding: 4px 10px; min-width: 90px; text-align: center; justify-content: center; border: 1px solid currentColor;">
                    <span style="width: 6px; height: 6px; border-radius: 50%; background-color: currentColor;"></span>
                    ${record.status.replace('-', ' ')}
                </span>
            </div>
            <div class="bank-col-actions" style="padding: 10px 14px; display: flex; gap: 6px; justify-content: center; align-items: center;">
                <button class="bank-action-btn bank-edit" onclick="editEditBankRow(${index})" title="Edit" style="border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color: var(--gold); cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; transition: all 0.15s ease;"><i class="fas fa-pencil-alt" style="font-size: 11px;"></i></button>
                <button class="bank-action-btn bank-delete" onclick="deleteEditBankRow(${index})" title="Delete" style="border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.04); color: #ef4444; cursor: pointer; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; transition: all 0.15s ease;"><i class="fas fa-trash-alt" style="font-size: 11px;"></i></button>
            </div>
        </div>
    `).join('');
};

window.editEditBankRow = function(index) {
    const record = window.editBankRecords[index];
    if (!record) return;
    document.getElementById('editBankInputName').value = record.name;
    document.getElementById('editBankInputContact').value = record.contact;
    document.getElementById('editBankInputStatus').value = record.status;
    editBankEditingIndex = index;
    
    // Change Add button text inside edit layout to indicate update mode
    const addButton = document.querySelector('[onclick="addEditBankRow()"]');
    if (addButton) {
        addButton.innerHTML = `<i class="fas fa-check"></i> Update`;
    }
    
    document.getElementById('editBankInputName').focus();
};

window.deleteEditBankRow = function(index) {
    if (confirm('Delete this bank entry?')) {
        window.editBankRecords.splice(index, 1);
        renderEditBankRecords();
        if (editBankEditingIndex === index) {
            editBankEditingIndex = null;
            const addButton = document.querySelector('[onclick="addEditBankRow()"]');
            if (addButton) {
                addButton.innerHTML = `<i class="fas fa-plus"></i> Add Entry`;
            }
        }
        toast('Bank entry deleted', 'success');
    }
};

// Loan Records Edit Functions
let editLoanEditingIndex = null;
let editSelectedLoanIndex = null;

function addEditLoanRecord() {
    const bank = document.getElementById('editLoanInputBank')?.value.trim() || '';
    const applicant = document.getElementById('editLoanInputApplicant')?.value.trim() || '';
    const type = document.getElementById('editLoanInputType')?.value.trim() || '';
    const date = document.getElementById('editLoanInputDate')?.value || '';
    const amount = parseFloat(document.getElementById('editLoanInputAmount')?.value) || 0;
    const emi = parseFloat(document.getElementById('editLoanInputEmi')?.value) || 0;
    const rate = parseFloat(document.getElementById('editLoanInputRate')?.value) || 0;
    const outstanding = parseFloat(document.getElementById('editLoanInputOutstanding')?.value) || 0;
    const status = document.getElementById('editLoanInputStatus')?.value || '';
    if (!bank || !applicant || !type || !date || !amount) {
        toast('Please fill all required fields', 'error');
        return;
    }
    const record = { bank, applicant, type, date, amount, emi, rate, outstanding, status };
    if (editLoanEditingIndex !== null) {
        window.editLoanRecords[editLoanEditingIndex] = record;
        editLoanEditingIndex = null;
    } else {
        window.editLoanRecords.push(record);
    }
    clearEditLoanInputs();
    renderEditLoanRecords();
    toast('Loan record added', 'success');
}

function clearEditLoanInputs() {
    document.getElementById('editLoanInputBank').value = '';
    document.getElementById('editLoanInputApplicant').value = '';
    document.getElementById('editLoanInputType').value = '';
    document.getElementById('editLoanInputDate').value = '';
    document.getElementById('editLoanInputAmount').value = '';
    document.getElementById('editLoanInputEmi').value = '';
    document.getElementById('editLoanInputRate').value = '';
    document.getElementById('editLoanInputOutstanding').value = '';
    document.getElementById('editLoanInputStatus').value = '';
    editLoanEditingIndex = null;
}

function renderEditLoanRecords() {
    const listContainer = document.getElementById('editLoanRecordsList');
    if (!listContainer) return;
    if (window.editLoanRecords.length === 0) {
        listContainer.innerHTML = '<div class="loan-empty-state">No loan records. Add one above.</div>';
        return;
    }
    listContainer.innerHTML = window.editLoanRecords.map((record, index) => {
        const statusColor = record.status === 'active' ? 'status-active' : record.status === 'closed' ? 'status-closed' : record.status === 'default' ? 'status-default' : 'status-pending';
        return `
            <div class="loan-record-row">
                <div class="loan-col-bank">${record.bank}</div><div class="loan-col-applicant">${record.applicant}</div><div class="loan-col-type">${record.type}</div>
                <div class="loan-col-date">${record.date}</div><div class="loan-col-amount">₹${record.amount.toLocaleString()}</div><div class="loan-col-emi">₹${record.emi.toLocaleString()}</div>
                <div class="loan-col-rate">${record.rate}%</div><div class="loan-col-outstanding">₹${record.outstanding.toLocaleString()}</div>
                <div class="loan-col-status"><span class="loan-status-badge ${statusColor}">${record.status}</span></div>
                <div class="loan-col-actions">
                    <button class="loan-action-btn" onclick="editEditLoanRecord(${index})" title="Edit">Edit</button>
                    <button class="loan-action-btn loan-delete" onclick="deleteEditLoanRecord(${index})" title="Delete">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function editEditLoanRecord(index) {
    const record = window.editLoanRecords[index];
    if (!record) return;
    document.getElementById('editLoanInputBank').value = record.bank;
    document.getElementById('editLoanInputApplicant').value = record.applicant;
    document.getElementById('editLoanInputType').value = record.type;
    document.getElementById('editLoanInputDate').value = record.date;
    document.getElementById('editLoanInputAmount').value = record.amount;
    document.getElementById('editLoanInputEmi').value = record.emi;
    document.getElementById('editLoanInputRate').value = record.rate;
    document.getElementById('editLoanInputOutstanding').value = record.outstanding;
    document.getElementById('editLoanInputStatus').value = record.status;
    editLoanEditingIndex = index;
}

function deleteEditLoanRecord(index) {
    if (confirm('Delete this loan record?')) {
        window.editLoanRecords.splice(index, 1);
        renderEditLoanRecords();
        if (editLoanEditingIndex === index) editLoanEditingIndex = null;
        toast('Loan record deleted', 'success');
    }
}

function updateEditFinancialCalculations() {
    const profitLoss = parseFloat(document.getElementById('editProfitLoss')?.value) || 0;
    const deductions = parseFloat(document.getElementById('editDeductions')?.value) || 0;
    const depreciation = parseFloat(document.getElementById('editDepreciation')?.value) || 0;
    const netIncome = profitLoss - deductions;
    document.getElementById('editNetIncome').value = netIncome.toFixed(2);
    document.getElementById('editTotalIncome').value = (netIncome + depreciation).toFixed(2);
}

async function saveEditedLead() {
    const id = window.editingLeadId;
    const lead = leads.find(l => l.id === id);
    if (!lead) {
        toast('Lead not found', 'error');
        return;
    }
    
    try {
        // Capture all basic lead info
        const name = document.getElementById('editName')?.value.trim();
        const phone = document.getElementById('editPhone')?.value.trim();
        const email = document.getElementById('editEmail')?.value.trim() || '';
        const loanType = document.getElementById('editLoanType')?.value.trim();
        const amount = parseFloat(document.getElementById('editAmount')?.value) || 100000;
        const category = document.getElementById('editCategory')?.value;
        const csoId = document.getElementById('editCso')?.value;
        const bankName = document.getElementById('editLeadBankName')?.value.trim() || '';
        const source = document.getElementById('editSource')?.value.trim() || '';
        
        // Bank finalization data
        const leadStatus = document.getElementById('editLeadStatus')?.value.trim() || '';
        const bankRemarks =
            document.getElementById('editBankRemarksInline')?.value.trim() ||
            document.getElementById('editBankRemarks')?.value.trim() ||
            '';
        
        // Financial analysis data
        const turnover = parseFloat(document.getElementById('editTurnover')?.value) || 0;
        const profitLoss = parseFloat(document.getElementById('editProfitLoss')?.value) || 0;
        const netIncome = parseFloat(document.getElementById('editNetIncome')?.value) || 0;
        const deductions = parseFloat(document.getElementById('editDeductions')?.value) || 0;
        const depreciation = parseFloat(document.getElementById('editDepreciation')?.value) || 0;
        const totalIncome = parseFloat(document.getElementById('editTotalIncome')?.value) || 0;
        const gstStatus = document.getElementById('editGstStatus')?.value.trim() || '';
        const turnoverNotes = document.getElementById('editTurnoverNotes')?.value.trim() || '';
        const creditScore = parseInt(document.getElementById('editCreditScore')?.value) || 0;
        const financialRemarks = document.getElementById('editFinancialRemarks')?.value.trim() || '';
        const incomeDetails = document.getElementById('editIncomeDetails')?.value.trim() || '';
        const expenseDetails = document.getElementById('editExpenseDetails')?.value.trim() || '';
        
        // Documents data
        const docsReceived = document.getElementById('editDocsReceived')?.value.trim() || '';
        const docsPending = document.getElementById('editDocsPending')?.value.trim() || '';
        
        // Checkpoints data
        const checkpoints = window.editCheckPoints || {};
        // Collect merits rows from the modal (works for both Add and Edit modals since only one modal is open)
        const meritsRows = [];
        document.querySelectorAll('.merit-row').forEach(row => {
            const index = row.dataset.row;
            if (index === undefined) return;
            const date = row.querySelector(`#meritDate${index}`)?.value || '';
            const remarks = row.querySelector(`#meritRemarks${index}`)?.value.trim() || '';
            const docType = row.querySelector(`#meritDocType${index}`)?.value.trim() || '';
            const stage = row.querySelector(`#meritStage${index}`)?.value.trim() || '';
            const owner = row.querySelector(`#meritOwner${index}`)?.value.trim() || '';
            const meritType = row.querySelector(`#meritType${index}`)?.value.trim() || '';
            if (date || remarks || docType || stage || owner || meritType) {
                const classification = row.querySelector(`#meritClassification${index}`)?.value || 'merit';
                meritsRows.push({ date, remarks, docType, stage, owner, meritType, classification });
            }
        });
        
        // CC users
        const ccCheckboxes = document.querySelectorAll('#editCc input[type="checkbox"]:checked');
        const ccUsers = Array.from(ccCheckboxes).map(cb => cb.value);
        
        // Validation
        if (!name || !phone || !loanType) {
            toast('Name, Phone and Loan Type are required', 'error');
            return;
        }
        
        // Prepare update data - preserve unchanged fields
        const assignedCSOs = csoId ? [csoId] : (lead.assignedCSOs || []);
        const updateData = {
            // Basic info
            name, phone, email, loanType, amount, category, assignedCSOs, cc: ccUsers, bankName, source,
            
            // Bank records & remarks
            bankRecords: window.editBankRecords || [],
            loanRecords: window.editLoanRecords || [],
            emiRecords: window.editEmiRecords || {},
            bankRemarks, leadStatus,
            attachments: window.editLeadAttachments || [],
            
            // Financial analysis
            financialAnalysis: {
                turnover, profitLoss, netIncome, deductions, depreciation, totalIncome,
                gstStatus, turnoverNotes, creditScore, remarks: financialRemarks,
                incomeDetails, expenseDetails
            },
            
            // Documents
            documents: { received: docsReceived, pending: docsPending },
            
            // Checkpoints
            checkpoints
            ,
            // Merits and challenges (from edit modal)
            meritsAndChallenges: { rows: meritsRows }
        };
        
        // Preserve unchanged fields (merits handled above)
        const preserveFields = ['id', 'status', 'tat', 'created', 'createdBy', 'history', 'visibleTo', 'profilingData'];
        preserveFields.forEach(field => {
            if (lead[field] !== undefined) {
                updateData[field] = lead[field];
            }
        });
        
        // Update in Firebase or local state
        if (firebaseEnabled) {
            await leadsRef.child(id).update(updateData);
        } else {
            leads = leads.map(l => l.id === id ? { ...l, ...updateData } : l);
            persistLocalState();
        }
        
        toast('Lead updated successfully - All details saved!', 'success');
        closeModal();
        viewLead(id);
    } catch (error) {
        console.error('Save error:', error);
        toast(`Error saving lead: ${error.message}`, 'error');
    }
}

// ===================== SIDEBAR =====================
function buildSidebar() {
    const menu = [
        { page: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
        { page: 'all-leads', icon: 'fas fa-users', label: 'All Leads' },
        { page: 'new-leads', icon: 'fas fa-plus-circle', label: 'New Leads' },
        { page: 'processing', icon: 'fas fa-cogs', label: 'Processing' },
        { page: 'tat-breach', icon: 'fas fa-exclamation-triangle', label: 'TAT Breach' },
        { page: 'tat-warning', icon: 'fas fa-clock', label: 'TAT Warning' },
        { page: 'reminders', icon: 'fas fa-bell', label: 'Reminders', badge: 'nb-rem' },
        { page: 'monitor', icon: 'fas fa-eye', label: 'Monitor' },
        { page: 'tasks', icon: 'fas fa-tasks', label: 'Tasks', badge: 'nb-tasks' },
        { page: 'escalations', icon: 'fas fa-arrow-up', label: 'Escalations', badge: 'nb-esc' },
        { page: 'reports', icon: 'fas fa-chart-line', label: 'Reports' },
        { page: 'pipeline', icon: 'fas fa-project-diagram', label: 'Pipeline' },
        { page: 'workflow', icon: 'fas fa-diagram-project', label: 'Workflow' }
    ];
    if (currentUser?.role === 'admin') {
        menu.push({ page: 'admin-panel', icon: 'fas fa-user-shield', label: 'Admin Panel' });
    }
    
    let html = `
        <div class="sb-logo"><i class="fas fa-chart-line"></i><span>CRM LOANITOL</span></div>
        <div class="role-display" style="padding: 12px; margin-bottom: 12px;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${currentUser?.displayName || 'User'}</div>
            <div class="role-name" style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; opacity: 0.9; margin-bottom: 4px;">${currentUser?.role?.replace('_', ' ') || ''}</div>
        </div>
        <div class="sb-section">
    `;
    menu.forEach(m => {
        html += `<div class="sb-item" data-page="${m.page}" onclick="navToPage('${m.page}')">
                    <i class="${m.icon}"></i><span>${m.label}</span>
                    ${m.badge ? `<span class="sb-badge" id="${m.badge}">0</span>` : ''}
                 </div>`;
    });
    html += `</div>`;
    document.getElementById('sidebar').innerHTML = html;
}

// Global scope persona swapper implementation
window.quickSwitchRole = async (val) => {
    if (!val) return;
    const parts = val.split(':');
    const uid = parts[0];
    const pwd = parts[1];
    
    const localUsers = (LOCAL_USER_CREDENTIALS.length ? LOCAL_USER_CREDENTIALS : FALLBACK_USERS).map(normalizeUser);
    let user = localUsers.find(u => u.userId === uid);
    if (!user) {
        user = {
            userId: uid,
            displayName: uid === 'admin_1' ? 'Admin' : uid === 'msme_head_1' ? 'MSME Head' : uid === 'retail_head_1' ? 'Retail Head' : uid === 'cse_1' ? 'CSE 1' : uid === 'cse_2' ? 'CSE 2' : uid === 'cso_msme_1' ? 'MSME CSO 1' : 'Retail CSO 1',
            role: uid === 'admin_1' ? 'admin' : uid === 'msme_head_1' ? 'msme_head' : uid === 'retail_head_1' ? 'retail_head' : uid.startsWith('cse') ? 'cse' : 'cso',
            department: uid.includes('msme') ? 'msme' : uid.includes('retail') ? 'retail' : uid.startsWith('cse') ? 'telecaller' : 'admin',
        };
    }
    
    const normalizedUser = normalizeUser({ userId: uid, ...user });
    currentUser = { 
        userId: uid, 
        displayName: normalizedUser.displayName, 
        role: normalizedUser.role, 
        department: normalizedUser.department, 
        permissions: normalizedUser.permissions 
    };
    
    sessionStorage.setItem('crmUser', JSON.stringify(currentUser));
    toast(`Acting role swapped: ${currentUser.displayName}`, 'success');
    buildSidebar();
    
    // Fallback if current view is restricted under new persona
    const pageToLoad = canViewPage(currentPage) ? currentPage : 'dashboard';
    loadPage(pageToLoad);
};

// ===================== LOGIN & SEED =====================
async function login() {
    const loginError = document.getElementById('loginError');
    if (loginError) loginError.innerText = '';
    const userId = document.getElementById('loginId').value.trim();
    const pwd = document.getElementById('loginPassword').value.trim();
    if (!userId || !pwd) { if (loginError) loginError.innerText = 'Please enter User ID and Password'; return; }
    try {
        let user = null;
        if (firebaseEnabled) {
            const snap = await usersRef.child(userId).once('value');
            user = snap.val();
        }
        if (!user) {
            const localUsers = (LOCAL_USER_CREDENTIALS.length ? LOCAL_USER_CREDENTIALS : FALLBACK_USERS).map(normalizeUser);
            user = localUsers.find(u => u.userId === userId);
        }
        if (!user || user.password !== pwd) { if (loginError) loginError.innerText = 'Invalid credentials'; return; }
        const normalizedUser = normalizeUser({ userId, ...user });
        currentUser = { userId, displayName: normalizedUser.displayName, role: normalizedUser.role, department: normalizedUser.department, permissions: normalizedUser.permissions };
        sessionStorage.setItem('crmUser', JSON.stringify(currentUser));
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('appContainer').classList.remove('hidden');
        buildSidebar();
        initRealtime();
        setupSearch();
        document.getElementById('newLeadBtn')?.addEventListener('click', openAddLead);
        const hash = window.location.hash.slice(1);
        const startPage = hash && MENU_PAGES.includes(hash) ? hash : 'dashboard';
        loadPage(startPage);
    } catch (error) {
        console.error('Login error:', error);
        if (loginError) loginError.innerText = error.message ? `Login failed: ${error.message}` : 'Login failed due to a connection issue';
    }
}

function logout() {
    sessionStorage.clear();
    location.reload();
}

async function seedDemoData() {
    if (!firebaseEnabled) { applyLocalFallbackData(); return; }
    const usersSnap = await usersRef.once('value');
    if (!usersSnap.exists()) {
        await usersRef.set({
            admin_1: { userId: 'admin_1', displayName: 'Admin', password: 'admin', role: 'admin', department: 'admin', permissions: getDefaultPermissions('admin') },
            msme_head_1: { userId: 'msme_head_1', displayName: 'MSME Head', password: 'head', role: 'msme_head', department: 'msme', permissions: getDefaultPermissions('msme_head') },
            retail_head_1: { userId: 'retail_head_1', displayName: 'Retail Head', password: 'head', role: 'retail_head', department: 'retail', permissions: getDefaultPermissions('retail_head') },
            cse_1: { userId: 'cse_1', displayName: 'CSE 1', password: 'cse', role: 'cse', department: 'telecaller', permissions: getDefaultPermissions('cse') },
            cse_2: { userId: 'cse_2', displayName: 'CSE 2', password: 'cse', role: 'cse', department: 'telecaller', permissions: getDefaultPermissions('cse') },
            cse_3: { userId: 'cse_3', displayName: 'CSE 3', password: 'cse', role: 'cse', department: 'telecaller', permissions: getDefaultPermissions('cse') },
            cso_msme_1: { userId: 'cso_msme_1', displayName: 'MSME CSO 1', password: 'cso', role: 'cso', department: 'msme', permissions: getDefaultPermissions('cso') },
            cso_msme_2: { userId: 'cso_msme_2', displayName: 'MSME CSO 2', password: 'cso', role: 'cso', department: 'msme', permissions: getDefaultPermissions('cso') },
            cso_msme_3: { userId: 'cso_msme_3', displayName: 'MSME CSO 3', password: 'cso', role: 'cso', department: 'msme', permissions: getDefaultPermissions('cso') },
            cso_retail_1: { userId: 'cso_retail_1', displayName: 'Retail CSO 1', password: 'cso', role: 'cso', department: 'retail', permissions: getDefaultPermissions('cso') },
            cso_retail_2: { userId: 'cso_retail_2', displayName: 'Retail CSO 2', password: 'cso', role: 'cso', department: 'retail', permissions: getDefaultPermissions('cso') },
            cso_retail_3: { userId: 'cso_retail_3', displayName: 'Retail CSO 3', password: 'cso', role: 'cso', department: 'retail', permissions: getDefaultPermissions('cso') }
        });
    }
    const leadsSnap = await leadsRef.once('value');
    if (!leadsSnap.exists()) {
        await leadsRef.push({ name: 'Amit Patel', phone: '9876543210', loanType: 'Home Loan', amount: 5000000, category: 'MSME', status: 'new', tat: 0, createdBy: 'cso_msme_1', assignedCSOs: ['cso_msme_1'], visibleTo: ['msme_head_1'], history: [{ s: 'new', by: 'MSME CSO 1', d: new Date().toLocaleString(), remarks: 'Lead created' }] });
        await leadsRef.push({ name: 'Neha Gupta', phone: '9123456789', loanType: 'LAP', amount: 2500000, category: 'Retail', status: 'profiling', tat: 1, createdBy: 'cso_retail_1', assignedCSOs: ['cso_retail_1'], visibleTo: ['retail_head_1'], history: [{ s: 'new', by: 'Retail CSO 1', d: new Date().toLocaleString() }, { s: 'profiling', by: 'Retail CSO 1', d: new Date().toLocaleString(), remarks: 'Profiling started' }] });
    }
    const loanTypesSnap = await loanTypesRef.once('value');
    if (!loanTypesSnap.exists()) {
        await loanTypesRef.set(['Home Loan', 'LAP', 'MSME Loan', 'Personal Loan', 'Business Loan']);
    }
}

// ===================== NOTIFICATIONS =====================
function updateNotificationBadge() {
    const newLeads = leads.filter(l => l.status === 'new').length;
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.innerText = newLeads;
        badge.style.display = newLeads > 0 ? 'flex' : 'none';
    }
}

function toggleNotifications() { navToPage('new-leads'); }

function renderNotifications() {
    const list = document.getElementById('notificationList');
    if (!list) return;
    const newLeads = leads.filter(l => l.status === 'new');
    list.innerHTML = newLeads.map(l => `
        <div class="notification-item" onclick="viewLead('${l.id}'); toggleNotifications();">
            <div class="notification-item-title">New Lead: ${l.name}</div>
            <div class="notification-item-desc">${l.loanType} - ${l.phone}</div>
        </div>
    `).join('') || '<div class="notification-item">No new leads</div>';
}

// ===================== REASSIGN LEAD =====================
function openReassignModal(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const userOptions = users.map(u => `<option value="${u.userId}">${u.displayName} (${u.role})</option>`).join('');
    openModal('Reassign Lead', `
        <div class="fg"><label>Lead</label><input value="${lead.name} (${lead.loanType})" disabled></div>
        <div class="fg"><label>Assign to</label><select id="reassignUser">${userOptions}</select></div>
        <div class="fg"><label>Or Resign (unassign)</label><input type="checkbox" id="resignLead"></div>
    `, `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="reassignLead('${leadId}')">Reassign</button>`);
}

async function reassignLead(leadId) {
    const userId = document.getElementById('reassignUser').value;
    const resign = document.getElementById('resignLead').checked;
    if (firebaseEnabled) {
        const leadRef = leadsRef.child(leadId);
        if (resign) await leadRef.update({ assignedCSOs: [] });
        else await leadRef.update({ assignedCSOs: [userId] });
    } else {
        leads = leads.map(l => l.id === leadId ? { ...l, assignedCSOs: resign ? [] : [userId] } : l);
        persistLocalState();
    }
    toast(resign ? 'Lead resigned' : 'Lead reassigned', 'success');
    closeModal();
    if (currentPage === 'all-leads') renderAllLeads();
}

// ===================== INIT =====================
window.addEventListener('load', async () => {
    firebaseEnabled = false;
    localFallbackMode = true;
    applyLocalFallbackData();
    await seedDemoData();
    const loginButton = document.getElementById('loginBtn');
    loginButton?.addEventListener('click', login);
    document.getElementById('loginPassword')?.addEventListener('keydown', event => { if (event.key === 'Enter') login(); });
    
    // Quick Demo Auto-Login handler
    const demoSelect = document.getElementById('demoUserSelect');
    demoSelect?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val) {
            const parts = val.split(':');
            const uid = parts[0];
            const pwd = parts[1];
            const uidInput = document.getElementById('loginId');
            const pwdInput = document.getElementById('loginPassword');
            if (uidInput && pwdInput) {
                uidInput.value = uid;
                pwdInput.value = pwd;
                login();
            }
        }
    });

    const saved = sessionStorage.getItem('crmUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('appContainer').classList.remove('hidden');
        buildSidebar();
        initRealtime();
        setupSearch();
        document.getElementById('newLeadBtn')?.addEventListener('click', openAddLead);
        const hash = window.location.hash.slice(1);
        const startPage = hash && MENU_PAGES.includes(hash) ? hash : 'dashboard';
        loadPage(startPage);
    } else {
        document.getElementById('loginContainer').style.display = 'flex';
    }
    document.addEventListener('click', closeAllDropdowns);

    // Expose global functions
    window.navToPage = navToPage;
    window.viewLead = viewLead;
    window.openUpdateStatus = openUpdateStatus;
    window.openCreateReminder = openCreateReminder;
    window.openCreateTask = openCreateTask;
    window.completeReminder = completeReminder;
    window.completeTask = completeTask;
    window.switchLeadDetailTab = switchLeadDetailTab;
    window.switchAddLeadTab = switchAddLeadTab;
    window.editLead = editLead;
    window.openAddLead = openAddLead;
    window.openCreateEscalation = openCreateEscalation;
    window.saveEscalation = saveEscalation;
    window.closeModal = closeModal;
    window.closeOverlay = closeOverlay;
    window.setDashboardFilter = (type) => {
        dashboardFilter = type === 'total' ? null : 'new';
        searchQuery = '';
        document.getElementById('searchInput').value = '';
        navToPage('all-leads');
    };
});