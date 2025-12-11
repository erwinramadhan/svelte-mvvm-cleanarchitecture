<script lang="ts">
	import { goto } from '$app/navigation';
	import { createRegisterViewModel } from '$application/container';
	import type { RegisterCredentials } from '$core/models/User';
	import {
		Badge,
		Button,
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
		Input,
		Textarea
	} from '$lib/components/ui';
	import FormField from '$presentation/components/register/FormField.svelte';
	import FormSection from '$presentation/components/register/FormSection.svelte';
	import SummaryPanel from '$presentation/components/register/SummaryPanel.svelte';
	import {
		Activity,
		Compass,
		Fingerprint,
		KeyRound,
		MapPin,
		ShieldPlus,
		UserCog
	} from '@lucide/svelte';

	const viewModel = createRegisterViewModel();
	const error = viewModel.error;
	const isLoading = viewModel.isLoading;

	export let data;
	console.log('Layout data:', data);

	type RegisterFormState = RegisterCredentials;

	const initialForm: RegisterFormState = {
		email: 'john.doe@example.com',
		fullName: 'John Doe',
		primaryBranchID: 'VORN0JZ2vk12XW1MhPLclvRK',
		userType: 'internal',
		username: 'johndoe01',
		activityLat: '-6.200000',
		activityLon: '106.816666',
		passwordRaw: 'S3cur3P@ssw0rd!',
		firstName: 'John',
		lastName: 'Doe',
		gender: 'male',
		birthPlace: 'Jakarta',
		dateOfBirth: '1999-12-31',
		nik: '3276100502970001',
		nationality: 'ID',
		religion: 'Islam',
		maritalStatus: 'single',
		phone: '081234567890',
		address: 'Jl. Merpati No. 123, Jakarta Selatan',
		profession: 'Software Engineer',
		addressLat: '-6.200500',
		addressLon: '106.816900',
		settings: '{"theme":"dark","language":"id"}',
		roleCode: 'platform_admin'
	};

	let form: RegisterFormState = { ...initialForm };

	const steps = [
		{
			title: 'Identitas Pengguna',
			description: 'Email, username, nama & identitas personal',
			fields: [
				'email',
				'username',
				'fullName',
				'firstName',
				'lastName',
				'gender',
				'dateOfBirth',
				'nik'
			]
		},
		{
			title: 'Alamat & Kontak',
			description: 'Alamat domisili, telepon, profesi',
			fields: ['address', 'phone', 'addressLat', 'addressLon', 'profession']
		},
		{
			title: 'Akses & Aktivitas',
			description: 'Cabang utama, role, user type, koordinat',
			fields: ['primaryBranchID', 'roleCode', 'userType', 'activityLat', 'activityLon']
		},
		{
			title: 'Keamanan',
			description: 'Password & preferensi settings',
			fields: ['passwordRaw', 'settings']
		}
	] as const;

	$: summarySteps = steps.map((step) => ({
		title: step.title,
		description: step.description,
		complete: step.fields.every((field) => {
			const value = form[field as keyof RegisterFormState];
			return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
		})
	}));

	$: payloadPreview = JSON.stringify(form, null, 2);

	const fieldSurfaceClass =
		'h-11 w-full rounded-lg border border-input/60 bg-background/70 px-3 text-sm text-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.08)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

	type InputEvent =
		| (Event & { currentTarget: HTMLInputElement })
		| (Event & { currentTarget: HTMLTextAreaElement })
		| (Event & { currentTarget: HTMLSelectElement });

	const handleInput =
		<K extends keyof RegisterFormState>(key: K) =>
		(event: InputEvent) => {
			const target = event.currentTarget as
				| HTMLInputElement
				| HTMLTextAreaElement
				| HTMLSelectElement;
			updateField(key, target.value as RegisterFormState[K]);
		};

	function updateField<K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) {
		form = { ...form, [key]: value };
	}

	function resetForm() {
		form = { ...initialForm };
		viewModel.clearError();
	}

	async function handleRegister() {
		const result = await viewModel.register(form);

		if (result.success) {
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Register Pengguna | MVVM Boilerplate</title>
</svelte:head>

<div class="dark relative min-h-screen bg-slate-950 text-slate-50">
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"></div>
		<div class="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl"></div>
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(129,140,248,0.12),transparent_30%)]"
		></div>
	</div>

	<main class="relative z-10 mx-auto max-w-6xl px-4 py-10 lg:py-12">
		<div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div class="space-y-3">
				<div class="flex items-center gap-2 text-xs tracking-[0.24em] text-sky-300/80 uppercase">
					<ShieldPlus class="size-4" />
					<span>Pendaftaran User</span>
				</div>
				<h1 class="text-3xl font-semibold text-white">Pendaftaran Pengguna Platform</h1>
				<p class="max-w-2xl text-sm text-slate-300">Isi data lengkap sesuai payload onboarding.</p>
				<div class="flex flex-wrap gap-2">
					<Badge variant="success">Payload lengkap</Badge>
					<Badge variant="muted">Endpoint /auth/register</Badge>
				</div>
			</div>

			<Card class="w-full max-w-md border-white/10 bg-white/5">
				<CardHeader class="space-y-3">
					<CardTitle class="text-white">Snapshot Data</CardTitle>
					<CardDescription>Koordinat aktivitas & akses pengguna.</CardDescription>
				</CardHeader>
				<CardContent class="grid grid-cols-2 gap-4 text-sm text-slate-200">
					<div>
						<p class="text-xs text-muted-foreground">User Type</p>
						<p class="font-semibold">{form.userType || 'internal'}</p>
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Role</p>
						<p class="font-semibold uppercase">{form.roleCode}</p>
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Cabang</p>
						<p class="font-semibold break-all">{form.primaryBranchID}</p>
					</div>
					<div>
						<p class="text-xs text-muted-foreground">Aktivitas</p>
						<p class="font-semibold">
							{form.activityLat}, {form.activityLon}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>

		<div class="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
			<div class="space-y-5">
				<FormSection
					title="Identitas Pengguna"
					subtitle="Data dasar pengguna beserta identitas personal."
					icon={Fingerprint}
					accent="from-sky-400/30 via-cyan-500/20 to-blue-600/10"
				>
					<div class="grid gap-4 md:grid-cols-2">
						<FormField label="Email" required>
							{#snippet children({ id })}
								<Input
									{id}
									type="email"
									placeholder="email@domain.com"
									value={form.email}
									oninput={handleInput('email')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Username" required description="Handle unik">
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="johndoe01"
									value={form.username}
									oninput={handleInput('username')}
								/>
							{/snippet}
						</FormField>
					</div>

					<FormField label="Nama Lengkap" required>
						{#snippet children({ id })}
							<Input
								{id}
								placeholder="John Doe"
								value={form.fullName}
								oninput={handleInput('fullName')}
							/>
						{/snippet}
					</FormField>

					<div class="grid gap-4 md:grid-cols-2">
						<FormField label="Nama Depan" required>
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="John"
									value={form.firstName}
									oninput={handleInput('firstName')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Nama Belakang" required>
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="Doe"
									value={form.lastName}
									oninput={handleInput('lastName')}
								/>
							{/snippet}
						</FormField>
					</div>

					<div class="grid gap-4 md:grid-cols-3">
						<FormField label="Jenis Kelamin" required>
							{#snippet children({ id })}
								<select
									{id}
									class={fieldSurfaceClass}
									value={form.gender}
									oninput={handleInput('gender')}
								>
									<option value="">Pilih</option>
									<option value="male">Laki-laki</option>
									<option value="female">Perempuan</option>
									<option value="other">Lainnya</option>
								</select>
							{/snippet}
						</FormField>
						<FormField label="Tempat Lahir" required>
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="Jakarta"
									value={form.birthPlace}
									oninput={handleInput('birthPlace')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Tanggal Lahir" required>
							{#snippet children({ id })}
								<Input
									{id}
									type="date"
									value={form.dateOfBirth}
									oninput={handleInput('dateOfBirth')}
								/>
							{/snippet}
						</FormField>
					</div>

					<FormField label="NIK" required description="Sesuai identitas resmi">
						{#snippet children({ id })}
							<Input
								{id}
								inputmode="numeric"
								placeholder="3276xxxxxxxxxxxx"
								value={form.nik}
								oninput={handleInput('nik')}
							/>
						{/snippet}
					</FormField>

					<div class="grid gap-4 md:grid-cols-3">
						<FormField label="Kewarganegaraan" required>
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="ID"
									value={form.nationality}
									oninput={handleInput('nationality')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Agama" required>
							{#snippet children({ id })}
								<select
									{id}
									class={fieldSurfaceClass}
									value={form.religion}
									oninput={handleInput('religion')}
								>
									<option value="">Pilih</option>
									<option value="Islam">Islam</option>
									<option value="Kristen">Kristen</option>
									<option value="Katolik">Katolik</option>
									<option value="Hindu">Hindu</option>
									<option value="Buddha">Buddha</option>
									<option value="Konghucu">Konghucu</option>
								</select>
							{/snippet}
						</FormField>
						<FormField label="Status Pernikahan" required>
							{#snippet children({ id })}
								<select
									{id}
									class={fieldSurfaceClass}
									value={form.maritalStatus}
									oninput={handleInput('maritalStatus')}
								>
									<option value="">Pilih</option>
									<option value="single">Belum menikah</option>
									<option value="married">Menikah</option>
									<option value="divorced">Bercerai</option>
								</select>
							{/snippet}
						</FormField>
					</div>
				</FormSection>

				<FormSection
					title="Alamat & Kontak"
					subtitle="Data domisili, koordinat alamat, dan kontak pengguna."
					icon={MapPin}
					accent="from-amber-400/20 via-orange-500/20 to-red-500/10"
				>
					<FormField label="Alamat" required description="Sesuai domisili">
						{#snippet children({ id })}
							<Textarea
								{id}
								placeholder="Jl. Merpati No. 123, Jakarta Selatan"
								value={form.address}
								oninput={handleInput('address')}
							/>
						{/snippet}
					</FormField>

					<div class="grid gap-4 md:grid-cols-3">
						<FormField label="Nomor Telepon" required>
							{#snippet children({ id })}
								<Input
									{id}
									type="tel"
									placeholder="0812xxxxxxx"
									value={form.phone}
									oninput={handleInput('phone')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Profesi">
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="Software Engineer"
									value={form.profession}
									oninput={handleInput('profession')}
								/>
							{/snippet}
						</FormField>
						<FormField label="User Type" required>
							{#snippet children({ id })}
								<select
									{id}
									class={fieldSurfaceClass}
									value={form.userType}
									oninput={handleInput('userType')}
								>
									<option value="internal">Internal</option>
									<option value="partner">Partner</option>
									<option value="external">External</option>
								</select>
							{/snippet}
						</FormField>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<FormField label="Latitude Alamat" required>
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="-6.200500"
									value={form.addressLat}
									oninput={handleInput('addressLat')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Longitude Alamat" required>
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="106.816900"
									value={form.addressLon}
									oninput={handleInput('addressLon')}
								/>
							{/snippet}
						</FormField>
					</div>
				</FormSection>

				<FormSection
					title="Akses & Aktivitas"
					subtitle="Cabang utama, koordinat aktivitas, serta preferensi role."
					icon={Activity}
					accent="from-emerald-400/25 via-teal-500/20 to-green-500/10"
				>
					<div class="grid gap-4 md:grid-cols-2">
						<FormField label="Primary Branch ID" required description="Cabang utama">
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="VORN0JZ2vk12XW1MhPLclvRK"
									value={form.primaryBranchID}
									oninput={handleInput('primaryBranchID')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Role Code" required>
							{#snippet children({ id })}
								<select
									{id}
									class={fieldSurfaceClass}
									value={form.roleCode}
									oninput={handleInput('roleCode')}
								>
									<option value="platform_admin">Platform Admin</option>
									<option value="radiology_staff">Radiology Staff</option>
									<option value="finance_officer">Finance Officer</option>
									<option value="viewer">Viewer</option>
								</select>
							{/snippet}
						</FormField>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<FormField label="Aktivitas Latitude" required>
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="-6.200000"
									value={form.activityLat}
									oninput={handleInput('activityLat')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Aktivitas Longitude" required>
							{#snippet children({ id })}
								<Input
									{id}
									placeholder="106.816666"
									value={form.activityLon}
									oninput={handleInput('activityLon')}
								/>
							{/snippet}
						</FormField>
					</div>

					<Card class="border-white/5 bg-white/5">
						<CardHeader class="space-y-2">
							<CardTitle class="text-base text-white">Tips validasi akses</CardTitle>
							<CardDescription
								>Pastikan koordinat dan role sudah selaras dengan policy.</CardDescription
							>
						</CardHeader>
						<CardContent class="space-y-3 text-sm text-slate-200">
							<div class="flex items-start gap-2">
								<Compass class="mt-0.5 size-4 text-sky-300" />
								<p>Gunakan titik desimal pada latitude/longitude.</p>
							</div>
							<div class="flex items-start gap-2">
								<KeyRound class="mt-0.5 size-4 text-emerald-300" />
								<p>Role wajib sesuai kode backend untuk otorisasi.</p>
							</div>
							<div class="flex items-start gap-2">
								<UserCog class="mt-0.5 size-4 text-indigo-300" />
								<p>User type & cabang utama menentukan cakupan akses modul.</p>
							</div>
						</CardContent>
					</Card>
				</FormSection>

				<FormSection
					title="Keamanan & Kredensial"
					subtitle="Password dan preferensi login pengguna."
					icon={KeyRound}
					accent="from-indigo-400/30 via-purple-500/20 to-fuchsia-500/10"
				>
					<div class="grid gap-4 md:grid-cols-2">
						<FormField label="Password" required>
							{#snippet children({ id })}
								<Input
									{id}
									type="password"
									placeholder="••••••••"
									value={form.passwordRaw}
									oninput={handleInput('passwordRaw')}
								/>
							{/snippet}
						</FormField>
						<FormField label="Settings JSON" description="Tema & bahasa">
							{#snippet children({ id })}
								<Input
									{id}
									placeholder={JSON.stringify({ theme: 'dark', language: 'id' })}
									value={form.settings}
									oninput={handleInput('settings')}
								/>
							{/snippet}
						</FormField>
					</div>

					<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						{#if $error}
							<p class="text-sm text-rose-300">{$error}</p>
						{:else}
							<p class="text-sm text-muted-foreground">
								Data akan dikirim sesuai payload contoh. Pastikan telah ditinjau.
							</p>
						{/if}

						<div class="flex gap-2">
							<Button type="button" variant="outline" onclick={resetForm} disabled={$isLoading}>
								Reset
							</Button>
							<Button type="button" onclick={handleRegister} disabled={$isLoading}>
								{#if $isLoading}
									Mendaftarkan...
								{:else}
									Daftarkan Pengguna
								{/if}
							</Button>
						</div>
					</div>
				</FormSection>

				<Card class="border-white/5 bg-slate-900/60">
					<CardHeader class="space-y-2">
						<CardTitle class="text-white">Payload Preview</CardTitle>
						<CardDescription>Payload yang akan dikirim ke endpoint /auth/register.</CardDescription>
					</CardHeader>
					<CardContent class="rounded-xl border border-white/5 bg-black/60 px-4 py-4">
						<pre class="max-h-[320px] overflow-auto text-xs text-slate-200">{payloadPreview}</pre>
					</CardContent>
				</Card>
			</div>

			<div class="space-y-4">
				<SummaryPanel steps={summarySteps} />

				<Card class="border-white/10 bg-white/5">
					<CardHeader class="space-y-2">
						<CardTitle class="text-lg text-white">Checklist singkat</CardTitle>
						<CardDescription>Pastikan angka wajib sudah lengkap.</CardDescription>
					</CardHeader>
					<CardContent class="space-y-2 text-sm text-slate-200">
						<div class="flex items-center gap-2">
							<div class="size-2 rounded-full bg-emerald-400"></div>
							Pastikan semua koordinat terisi.
						</div>
						<div class="flex items-center gap-2">
							<div class="size-2 rounded-full bg-sky-400"></div>
							Settings berupa string JSON valid.
						</div>
						<div class="flex items-center gap-2">
							<div class="size-2 rounded-full bg-amber-400"></div>
							Role dan user type selaras dengan policy.
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	</main>
</div>
