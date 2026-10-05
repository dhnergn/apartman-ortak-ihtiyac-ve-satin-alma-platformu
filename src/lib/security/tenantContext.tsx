import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Apartment,
  ApartmentUnit,
  Need,
  NeedParticipant,
  Provider,
  Quote,
  Vote,
  AuditLog,
  User,
  BallotDecision,
} from '../../types';
import {
  INITIAL_APARTMENTS,
  INITIAL_UNITS,
  INITIAL_NEEDS,
  INITIAL_PROVIDERS,
  INITIAL_QUOTES,
  INITIAL_VOTES,
  INITIAL_AUDIT_LOGS,
  DEMO_USERS,
} from '../db/mockStore';
import {
  createNeedSchema,
  joinNeedSchema,
  createQuoteSchema,
  castVoteSchema,
  createApartmentSchema,
} from '../validation/schemas';

interface TenantContextType {
  currentUser: User;
  currentApartment: Apartment;
  apartments: Apartment[];
  units: ApartmentUnit[];
  activeApartmentUnits: ApartmentUnit[];
  needs: Need[];
  quotes: Quote[];
  votes: Vote[];
  providers: Provider[];
  auditLogs: AuditLog[];
  switchUser: (userId: string) => void;
  switchApartment: (apartmentId: string) => void;
  registerApartment: (data: any) => { success: boolean; apartmentId?: string; error?: string };
  createNeed: (needData: any) => { success: boolean; error?: string };
  joinNeed: (needId: string, quantity: number, notes?: string) => { success: boolean; error?: string };
  leaveNeed: (needId: string) => { success: boolean; error?: string };
  submitQuote: (quoteData: any) => { success: boolean; error?: string };
  castVote: (voteId: string, decision: BallotDecision) => { success: boolean; error?: string };
  createVote: (voteData: { needId?: string; quoteId?: string; title: string; description: string; durationDays: number }) => { success: boolean; error?: string };
  currentUnit: ApartmentUnit | undefined;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence in local storage for smooth session retention
  const [apartments, setApartments] = useState<Apartment[]>(() => {
    const saved = localStorage.getItem('apt_apartments');
    return saved ? JSON.parse(saved) : INITIAL_APARTMENTS;
  });

  const [units, setUnits] = useState<ApartmentUnit[]>(() => {
    const saved = localStorage.getItem('apt_units');
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [needs, setNeeds] = useState<Need[]>(() => {
    const saved = localStorage.getItem('apt_needs');
    return saved ? JSON.parse(saved) : INITIAL_NEEDS;
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('apt_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [votes, setVotes] = useState<Vote[]>(() => {
    const saved = localStorage.getItem('apt_votes');
    return saved ? JSON.parse(saved) : INITIAL_VOTES;
  });

  const [providers, setProviders] = useState<Provider[]>(() => {
    const saved = localStorage.getItem('apt_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('apt_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>('usr-res-ahmet');
  const [currentApartmentId, setCurrentApartmentId] = useState<string>('apt-cinar-01');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('apt_apartments', JSON.stringify(apartments));
  }, [apartments]);

  useEffect(() => {
    localStorage.setItem('apt_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('apt_needs', JSON.stringify(needs));
  }, [needs]);

  useEffect(() => {
    localStorage.setItem('apt_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('apt_votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('apt_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem('apt_users');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  useEffect(() => {
    localStorage.setItem('apt_users', JSON.stringify(usersList));
  }, [usersList]);

  const currentUser = usersList.find((u) => u.id === currentUserId) || usersList[0];
  const currentApartment = apartments.find((a) => a.id === currentApartmentId) || apartments[0];

  // Active units for current apartment
  const activeApartmentUnits = units.filter((u) => u.apartmentId === currentApartment.id);
  const currentUnit = currentUser.unitId ? units.find((u) => u.id === currentUser.unitId) : undefined;

  // Filtered lists with strict tenant isolation
  const tenantNeeds = needs.filter((n) => n.apartmentId === currentApartment.id);
  const tenantQuotes = quotes.filter((q) => {
    const need = needs.find((n) => n.id === q.needId);
    return need && need.apartmentId === currentApartment.id;
  });
  const tenantVotes = votes.filter((v) => v.apartmentId === currentApartment.id);
  const tenantAuditLogs = auditLogs.filter((l) => l.apartmentId === currentApartment.id);

  const addAuditLog = (action: string, entityType: string, entityId: string, summary: string, targetAptId?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      apartmentId: targetAptId || currentApartment.id,
      userId: currentUser.id,
      userName: `${currentUser.fullName} ${currentUnit ? `(${currentUnit.unitNumber})` : ''}`,
      action,
      entityType,
      entityId,
      summary,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.104',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const switchUser = (userId: string) => {
    const user = usersList.find((u) => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
      if (user.apartmentId) {
        setCurrentApartmentId(user.apartmentId);
      }
    }
  };

  const switchApartment = (apartmentId: string) => {
    const apt = apartments.find((a) => a.id === apartmentId);
    if (apt) {
      setCurrentApartmentId(apt.id);
    }
  };

  // Apartman Yöneticisinin Yeni Apartman / Site Kaydı
  const registerApartment = (rawInput: any) => {
    try {
      const validated = createApartmentSchema.parse(rawInput);

      // Otomatik benzersiz güvenli davet kodu üret
      const cleanSlug = validated.name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const inviteCode = `${cleanSlug || 'APT'}${randomSuffix}`;

      const newApartmentId = `apt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

      // 1. Yeni Apartman Objesi
      const newApartment: Apartment = {
        id: newApartmentId,
        name: validated.name.trim(),
        city: validated.city.trim(),
        district: validated.district.trim(),
        addressLine: validated.addressLine.trim(),
        inviteCode,
        totalUnits: validated.totalUnits,
        managerId: currentUser.id,
        managerName: `${currentUser.fullName} (Yönetici)`,
        createdAt: new Date().toISOString(),
      };

      // 2. Daireleri Otomatik Üret (Örn: Daire 1, Daire 2... veya A01, A02...)
      const prefix = validated.unitPrefix || 'Daire ';
      const newUnits: ApartmentUnit[] = [];
      let managerUnitId = '';

      for (let i = 1; i <= validated.totalUnits; i++) {
        const uId = `unit-${newApartmentId}-${i}`;
        const uNum = `${prefix}${i}`;
        const isManagerUnit = String(i) === String(validated.managerUnitNumber).replace(/\D/g, '') || uNum === validated.managerUnitNumber;

        if (isManagerUnit || i === 1) {
          if (!managerUnitId) {
            managerUnitId = uId;
          }
        }

        newUnits.push({
          id: uId,
          apartmentId: newApartmentId,
          unitNumber: uNum,
          floorNumber: Math.ceil(i / 4), // 4 daire/kat tahmini
          residentName: (isManagerUnit || (i === 1 && !managerUnitId)) ? currentUser.fullName : undefined,
          residentId: (isManagerUnit || (i === 1 && !managerUnitId)) ? currentUser.id : undefined,
        });
      }

      // 3. Kullanıcıyı Yönetici rolüne yükselt ve bu apartmana bağla
      const updatedUser: User = {
        ...currentUser,
        role: 'MANAGER',
        apartmentId: newApartmentId,
        unitId: managerUnitId,
      };

      // State güncellemeleri
      setApartments((prev) => [newApartment, ...prev]);
      setUnits((prev) => [...prev, ...newUnits]);
      setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

      // Aktif apartmanı hemen yeni oluşturulan apartman yap
      setCurrentApartmentId(newApartmentId);

      // Audit Log kaydet
      addAuditLog(
        'apartment_created',
        'apartment',
        newApartmentId,
        `"${newApartment.name}" apartmanı (${validated.totalUnits} daire) yönetici ${currentUser.fullName} tarafından sisteme kaydedildi. Davet Kodu: ${inviteCode}`,
        newApartmentId
      );

      return { success: true, apartmentId: newApartmentId };
    } catch (err: any) {
      return { success: false, error: err.errors?.[0]?.message || err.message };
    }
  };

  // Create need with Zod validation and tenant binding
  const createNeed = (rawInput: any) => {
    try {
      const payload = {
        ...rawInput,
        apartmentId: currentApartment.id,
      };

      const validated = createNeedSchema.parse(payload);

      const needId = `need-${Date.now()}`;
      const newParticipant: NeedParticipant[] = [];

      let currentParticipants = 0;
      let totalQuantity = 0;

      // If resident creates, auto-join their own unit
      if (currentUnit) {
        newParticipant.push({
          id: `part-${Date.now()}`,
          needId,
          userId: currentUser.id,
          userName: currentUser.fullName,
          unitId: currentUnit.id,
          unitNumber: currentUnit.unitNumber,
          quantity: validated.initialQuantity,
          joinedAt: new Date().toISOString(),
          notes: validated.userNotes,
        });
        currentParticipants = 1;
        totalQuantity = validated.initialQuantity;
      }

      const newNeed: Need = {
        id: needId,
        apartmentId: currentApartment.id,
        createdBy: currentUser.id,
        createdByName: `${currentUser.fullName} ${currentUnit ? `(${currentUnit.unitNumber})` : ''}`,
        category: validated.category,
        title: validated.title,
        description: validated.description,
        type: validated.type,
        targetParticipants: validated.targetParticipants,
        currentParticipants,
        totalQuantity,
        estimatedBudget: validated.estimatedBudget,
        deadline: new Date(Date.now() + validated.deadlineDays * 86400000).toISOString(),
        status: 'COLLECTING_DEMAND',
        createdAt: new Date().toISOString(),
        participants: newParticipant,
      };

      setNeeds((prev) => [newNeed, ...prev]);
      addAuditLog('need_created', 'need', needId, `"${validated.title}" ihtiyacı oluşturuldu.`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.errors?.[0]?.message || err.message };
    }
  };

  // Join need (1 Daire = 1 Katılım kuralı)
  const joinNeed = (needId: string, quantity: number, notes?: string) => {
    if (!currentUnit) {
      return { success: false, error: 'Bu apartmanda atanmış geçerli bir daireniz bulunmamaktadır.' };
    }

    try {
      joinNeedSchema.parse({
        needId,
        apartmentId: currentApartment.id,
        unitId: currentUnit.id,
        quantity,
        notes,
      });

      const need = needs.find((n) => n.id === needId);
      if (!need) return { success: false, error: 'İhtiyaç bulunamadı.' };

      if (need.apartmentId !== currentApartment.id) {
        return { success: false, error: 'Güvenlik ihlali: Başka apartmanın ihtiyacına katılamazsınız.' };
      }

      const existingIndex = need.participants.findIndex((p) => p.unitId === currentUnit.id);
      if (existingIndex >= 0) {
        return { success: false, error: `Daireniz (${currentUnit.unitNumber}) zaten bu talebe katılmıştır. Dilerseniz ayrılıp yeniden katılabilirsiniz.` };
      }

      const newParticipant: NeedParticipant = {
        id: `part-${Date.now()}`,
        needId,
        userId: currentUser.id,
        userName: currentUser.fullName,
        unitId: currentUnit.id,
        unitNumber: currentUnit.unitNumber,
        quantity,
        notes,
        joinedAt: new Date().toISOString(),
      };

      const updatedParticipants = [...need.participants, newParticipant];
      const newTotalQuantity = updatedParticipants.reduce((sum, p) => sum + p.quantity, 0);

      // Status check: if target reached, change status
      let newStatus = need.status;
      if (updatedParticipants.length >= need.targetParticipants && need.status === 'COLLECTING_DEMAND') {
        newStatus = 'QUOTING';
      }

      setNeeds((prev) =>
        prev.map((n) =>
          n.id === needId
            ? {
                ...n,
                participants: updatedParticipants,
                currentParticipants: updatedParticipants.length,
                totalQuantity: newTotalQuantity,
                status: newStatus,
              }
            : n
        )
      );

      addAuditLog(
        'participant_joined',
        'need_participant',
        needId,
        `${currentUnit.unitNumber} dairesi ${quantity} adet ile "${need.title}" talebine katıldı.`
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.errors?.[0]?.message || err.message };
    }
  };

  const leaveNeed = (needId: string) => {
    if (!currentUnit) return { success: false, error: 'Daire bilgisi bulunamadı.' };

    const need = needs.find((n) => n.id === needId);
    if (!need) return { success: false, error: 'İhtiyaç bulunamadı.' };

    const updatedParticipants = need.participants.filter((p) => p.unitId !== currentUnit.id);
    const newTotalQuantity = updatedParticipants.reduce((sum, p) => sum + p.quantity, 0);

    setNeeds((prev) =>
      prev.map((n) =>
        n.id === needId
          ? {
              ...n,
              participants: updatedParticipants,
              currentParticipants: updatedParticipants.length,
              totalQuantity: newTotalQuantity,
            }
          : n
      )
    );

    addAuditLog('participant_left', 'need_participant', needId, `${currentUnit.unitNumber} dairesi talepten çekildi.`);
    return { success: true };
  };

  // Submit Quote with Immutable Versioning
  const submitQuote = (rawInput: any) => {
    try {
      const validated = createQuoteSchema.parse(rawInput);
      const provider = providers.find((p) => p.id === validated.providerId);
      if (!provider) return { success: false, error: 'Sağlayıcı bilgisi bulunamadı.' };

      const need = needs.find((n) => n.id === validated.needId);
      if (!need) return { success: false, error: 'Hedef ihtiyaç bulunamadı.' };

      // Calculate totals
      const subtotal = validated.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const tax = Math.round(subtotal * 0.2); // %20 KDV
      const total = subtotal + tax;

      // Check existing quotes from this provider for versioning
      const existingQuotes = quotes.filter((q) => q.needId === validated.needId && q.providerId === validated.providerId);
      const version = existingQuotes.length + 1;

      // Supersede older versions
      if (existingQuotes.length > 0) {
        setQuotes((prev) =>
          prev.map((q) =>
            q.needId === validated.needId && q.providerId === validated.providerId
              ? { ...q, status: 'SUPERSEDED' }
              : q
          )
        );
      }

      const quoteId = `quote-${provider.id}-v${version}-${Date.now().toString(36)}`;
      const newQuote: Quote = {
        id: quoteId,
        needId: validated.needId,
        providerId: provider.id,
        providerName: provider.companyName,
        providerVerification: provider.verificationStatus,
        providerRating: provider.ratingScore,
        version,
        items: validated.items.map((it, idx) => ({
          id: `qi-${Date.now()}-${idx}`,
          itemTitle: it.itemTitle,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.quantity * it.unitPrice,
        })),
        subtotal,
        tax,
        total,
        currency: 'TRY',
        validityDate: new Date(Date.now() + validated.validityDays * 86400000).toISOString(),
        completionTimeDays: validated.completionTimeDays,
        warrantyMonths: validated.warrantyMonths,
        installationIncluded: validated.installationIncluded,
        paymentTerms: validated.paymentTerms,
        description: validated.description,
        status: 'SUBMITTED',
        createdAt: new Date().toISOString(),
        revisionNotes: version > 1 ? `Sürüm v${version}: Teklif şartları güncellendi.` : undefined,
      };

      setQuotes((prev) => [newQuote, ...prev]);

      // If need was in collecting demand, move to quoting
      if (need.status === 'COLLECTING_DEMAND') {
        setNeeds((prev) => prev.map((n) => (n.id === need.id ? { ...n, status: 'QUOTING' } : n)));
      }

      addAuditLog(
        'quote_submitted',
        'quote',
        quoteId,
        `${provider.companyName}, "${need.title}" için v${version} teklifini sundu (Toplam: ${total.toLocaleString('tr-TR')} TL).`
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.errors?.[0]?.message || err.message };
    }
  };

  // Cast vote (1 Daire = 1 Oy İlkesi)
  const castVote = (voteId: string, decision: BallotDecision) => {
    if (!currentUnit) {
      return { success: false, error: 'Yalnızca apartman dairesi sakinleri oy kullanabilir.' };
    }

    try {
      castVoteSchema.parse({
        voteId,
        apartmentId: currentApartment.id,
        unitId: currentUnit.id,
        decision,
      });

      const vote = votes.find((v) => v.id === voteId);
      if (!vote) return { success: false, error: 'Oylama bulunamadı.' };

      if (vote.apartmentId !== currentApartment.id) {
        return { success: false, error: 'Güvenlik ihlali: Başka apartmanın oylamasına katılamazsınız.' };
      }

      if (vote.status !== 'ACTIVE') {
        return { success: false, error: 'Bu oylama sonuçlanmış ve kapanmıştır.' };
      }

      const existingBallot = vote.ballots.find((b) => b.unitId === currentUnit.id);
      if (existingBallot) {
        return { success: false, error: `Daireniz (${currentUnit.unitNumber}) adına daha önce oy kullanılmıştır (${existingBallot.decision}). Daire başına tek oy hakkı vardır.` };
      }

      const newBallot = {
        unitId: currentUnit.id,
        unitNumber: currentUnit.unitNumber,
        userId: currentUser.id,
        decision,
        castAt: new Date().toISOString(),
      };

      setVotes((prev) =>
        prev.map((v) =>
          v.id === voteId
            ? {
                ...v,
                ballots: [...v.ballots, newBallot],
              }
            : v
        )
      );

      const decisionText = decision === 'YES' ? 'KABUL' : decision === 'NO' ? 'RED' : 'ÇEKİMSER';
      addAuditLog(
        'vote_cast',
        'vote_ballot',
        voteId,
        `${currentUnit.unitNumber} dairesi "${vote.title}" oylamasında ${decisionText} oyu kullandı.`
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.errors?.[0]?.message || err.message };
    }
  };

  // Create vote (Manager yetkisi)
  const createVote = (voteData: { needId?: string; quoteId?: string; title: string; description: string; durationDays: number }) => {
    if (currentUser.role !== 'MANAGER') {
      return { success: false, error: 'Yalnızca apartman yöneticisi oylama başlatabilir.' };
    }

    const voteId = `vote-${Date.now()}`;
    const newVote: Vote = {
      id: voteId,
      apartmentId: currentApartment.id,
      needId: voteData.needId,
      quoteId: voteData.quoteId,
      title: voteData.title,
      description: voteData.description,
      createdBy: currentUser.id,
      createdByName: `${currentUser.fullName}`,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + voteData.durationDays * 86400000).toISOString(),
      status: 'ACTIVE',
      totalEligibleUnits: activeApartmentUnits.length || currentApartment.totalUnits,
      ballots: [],
    };

    setVotes((prev) => [newVote, ...prev]);

    // If linked to a need, update its status to VOTING
    if (voteData.needId) {
      setNeeds((prev) => prev.map((n) => (n.id === voteData.needId ? { ...n, status: 'VOTING' } : n)));
    }

    addAuditLog('vote_created', 'vote', voteId, `"${voteData.title}" için apartman genel oylaması başlatıldı.`);
    return { success: true };
  };

  return (
    <TenantContext.Provider
      value={{
        currentUser,
        currentApartment,
        apartments,
        units,
        activeApartmentUnits,
        needs: tenantNeeds,
        quotes: tenantQuotes,
        votes: tenantVotes,
        providers,
        auditLogs: tenantAuditLogs,
        switchUser,
        switchApartment,
        registerApartment,
        createNeed,
        joinNeed,
        leaveNeed,
        submitQuote,
        castVote,
        createVote,
        currentUnit,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
