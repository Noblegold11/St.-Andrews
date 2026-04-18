// --- MASTER INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Setup
    if (window.lucide) lucide.createIcons();
    startSessionTimer();

    // --- MOBILE NAVIGATION ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');

    const toggleMenu = (isOpen) => {
        if (!mobileOverlay) return;
        mobileOverlay.classList.toggle('translate-x-full', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    };

    mobileMenuBtn?.addEventListener('click', () => toggleMenu(true));
    closeMenuBtn?.addEventListener('click', () => toggleMenu(false));

    // --- ADMISSION FILING LOGIC (Fixed) ---
    const admissionForm = document.getElementById('admissionForm');
    const successOverlay = document.getElementById('admissionSuccess');

    admissionForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = admissionForm.querySelector('button[type="submit"]');
        
        // Visual Feedback
        submitBtn.disabled = true;
        submitBtn.innerText = "ENCRYPTING DOSSIER...";

        // Capture Data
        const formData = new FormData(admissionForm);
        const application = {
            id: "SA-" + Math.floor(Math.random() * 900000 + 100000),
            studentName: formData.get('studentName') || "Candidate",
            timestamp: new Date().toLocaleString(),
            status: "Review Pending"
        };

        // Save to Database
        const allApps = JSON.parse(localStorage.getItem('school_applications') || '[]');
        allApps.push(application);
        localStorage.setItem('school_applications', JSON.stringify(allApps));

        // Simulate "Filing" sequence
        setTimeout(() => {
            submitBtn.innerText = "FINALIZING...";
            
            setTimeout(() => {
                if (successOverlay) {
                    successOverlay.classList.remove('hidden');
                    successOverlay.classList.add('flex');
                    admissionForm.reset();
                    if (window.lucide) lucide.createIcons();
                } else {
                    alert("Dossier Filed! ID: " + application.id);
                    location.reload();
                }
            }, 1000);
        }, 1500);
    });

    // --- SECURE PAYMENT PROCESSING ---
    const paymentForm = document.getElementById('paymentForm');
    const payBtn = document.getElementById('payBtn');

    paymentForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = document.getElementById('feeType')?.value || "0";

        payBtn.disabled = true;
        payBtn.innerHTML = `<span class="flex items-center justify-center gap-2">
            <i data-lucide="loader" class="animate-spin w-4 h-4"></i> ENCRYPTING...</span>`;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            payBtn.innerText = "TRANSACTION SUCCESSFUL ✓";
            payBtn.className = "w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold transition-all";

            const history = JSON.parse(localStorage.getItem('school_payments') || '[]');
            history.push({
                type: "Digital Settlement",
                amount: "$" + amount,
                date: new Date().toLocaleString(),
                status: "Success"
            });
            localStorage.setItem('school_payments', JSON.stringify(history));

            setTimeout(() => {
                alert("Payment Verified.");
                location.reload(); 
            }, 1500);
        }, 2500);
    });
});

// --- GLOBAL PORTAL LOGIC ---
// Kept outside DOMContentLoaded so HTML onclick attributes can see them
let currentAuth = 'staff';

window.openPortal = function(type) {
    currentAuth = type;
    const modal = document.getElementById('loginModal');
    const title = document.getElementById('modalTitle');
    const sub = document.getElementById('modalSub');
    
    if (modal && title && sub) {
        title.innerText = type === 'staff' ? "Faculty Access" : "Parent Gateway";
        sub.innerText = type === 'staff' ? "Secure login for authorized personnel" : "Access student records";
        modal.classList.replace('hidden', 'flex');
    }
};

window.closeModal = function() {
    document.getElementById('loginModal')?.classList.replace('flex', 'hidden');
};

// --- AUTHENTICATION CHECK ---
document.getElementById('portalForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.querySelector('input[type="text"]').value;
    const pass = e.target.querySelector('input[type="password"]').value;

    if (currentAuth === 'staff' && id === 'ADMIN-01' && pass === '1234') {
        window.location.href = 'admin.html';
    } else {
        alert(currentAuth === 'staff' ? "Access Denied." : "Parent Portal under audit.");
    }
});

// --- TIMER FUNCTION ---
function startSessionTimer() {
    const el = document.getElementById('session-timer');
    if (!el) return;
    let time = 600; 
    const timer = setInterval(() => {
        if (time <= 0) return clearInterval(timer);
        time--;
        const m = Math.floor(time / 60);
        const s = time % 60;
        el.innerText = `Session: ${m}:${s < 10 ? '0' : ''}${s}`;
    }, 1000);
}