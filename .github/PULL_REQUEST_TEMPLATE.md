<!-- Pull request template for ISA content/sync patches -->

## Resumen
- ¿Qué cambia? Breve descripción.

## Por qué
- Motivación / problema que resuelve.

## Cómo probar localmente
1. pnpm install
2. pnpm exec tsc --noEmit
3. pnpm build
4. python -m http.server 4330 --directory out
5. Abrir http://127.0.0.1:4330/series.html y revisar episodio X y perfil

Si el PR incluye cambios en datos:
- Ejecutar scripts/sync_config.py --check --xlsx <archivo> o usar scripts/update-isa-config.py

## Checklist
- [ ] Typecheck (pnpm exec tsc --noEmit)
- [ ] Build (pnpm build)
- [ ] Smoke tests (abrir episodio /profile)
- [ ] No datos personales incluidos

## Notas
- Este PR incluye cambios de datos. Confirma que las referencias y los IDs existentes no cambian.
